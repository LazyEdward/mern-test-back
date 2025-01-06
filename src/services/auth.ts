// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { CONFLICT, TOO_MANY_REQUESTS, UNAUTHORIZED } from "../constants/httpStatus";
import VerificationType from "../constants/verificationType";
import SessionModel from "../models/session";
import UserModel from "../models/user";
import VerificationModel from "../models/verification";
import AppError from "../utils/AppError";
import { sendResetPasswordEmail, sendVerificationEmail } from "../utils/email";
import { getUserAccessToken, getUserRefreshToken, getUserSessionToken, verifyRefreshToken } from "../utils/userSessionToken";

export type TAccountParam = {
	email: string,
	password: string,
}

export type TLoginParam = {
	longLived?: boolean
} & TAccountParam

export type TResetPasswordParam = {
	code: string
} & TAccountParam

export const createAccount = async (data: TAccountParam) => {
	const getUserFromEmail = await UserModel.exists({ email: data.email })

	if (!!getUserFromEmail)
		throw new AppError("Account already exists", CONFLICT)

	const newUser = await UserModel.create(data)

	const verificationCode = await VerificationModel.create({
		userId: newUser._id,
		type: VerificationType.EMAIL,
		expireDateTime: Date.now() + 1000 * 60 * 60 * 24
	})

	// await sendVerificationEmail(newUser.email, verificationCode._id as string)

	const session = await SessionModel.create({
		userId: newUser._id,
		expireDateTime: Date.now() + 1000 * 60 * 60 * 6
	})

	const userSessionToken = getUserSessionToken(session._id as string, newUser._id as string);

	return { user: { ...newUser.toObject(), password: "****" }, ...userSessionToken, verificationCode }
}

// with reset password code
// export const updateUserPassword = async (data: TResetPasswordParam) => {
// 	console.log(data)
// 	const user = await UserModel.findOne({ email: data.email })

// 	if (!user)
// 		throw new AppError("Invalid email", UNAUTHORIZED)

// 	const verificationDetails = await VerificationModel.findOne({ _id: (data as TResetPasswordParam).code, type: VerificationType.RESET_PASSWORD, expireDateTime: { $lt: Date.now() } })

// 	if (!verificationDetails || verificationDetails.userId !== user._id)
// 		throw new AppError("Invalid or expired verification code", UNAUTHORIZED)

// 	user.password = (data as TAccountParam).password
// 	await user.save()

// 	await verificationDetails.deleteOne()
// 	await SessionModel.deleteMany({ userId: verificationDetails.userId })

// 	return { user: { ...user.toObject(), password: "****" }}

// }

// without reset password code
export const updateUserPassword = async (data: TAccountParam) => {
	console.log(data)
	const user = await UserModel.findOne({ email: data.email })

	if (!user)
		throw new AppError("Invalid email", UNAUTHORIZED)

	user.password = (data as TAccountParam).password
	await user.save()

	await SessionModel.deleteMany({ userId: user._id })

	return { user: { ...user.toObject(), password: "****" } }
}

export const login = async (data: TLoginParam) => {
	console.log(data)
	const user = await UserModel.findOne({ email: data.email })

	if (!user)
		throw new AppError("Invalid email or password", UNAUTHORIZED)

	const isValidPassword = await user.comparePassword(data.password)

	if (!isValidPassword)
		throw new AppError("Invalid email or password", UNAUTHORIZED)

	const session = await SessionModel.create({
		userId: user._id,
		expireDateTime: data.longLived ? Date.now() + 1000 * 60 * 60 * 24 * 30 : Date.now() + 1000 * 60 * 60 * 6,
		longLived: data.longLived
	})

	const userSessionToken = getUserSessionToken(session._id as string, user._id as string, data.longLived);

	return { user: { ...user.toObject(), password: "****" }, ...userSessionToken }
}

export const cleanSession = async (sessionId: string) => {
	await SessionModel.findByIdAndDelete(sessionId)
}

export const refreshSession = async (refreshToken: string) => {
	const payload = verifyRefreshToken(refreshToken);

	if (!payload || payload.status === "error")
		throw new AppError("Invalid refresh token", UNAUTHORIZED)

	const session = await SessionModel.findById(payload.sessionId)

	if (!session || session.expireDateTime < Date.now())
		throw new AppError("Session has already expired", UNAUTHORIZED)

	// extend session if it's expiring
	const isExpiring = await session.isExpiring()

	if (isExpiring)
		await session.extendSession()

	const accessToken = getUserAccessToken(session._id as string, session._id as string);
	const newRefreshToken = isExpiring ? getUserRefreshToken(session._id as string, session.longLived) : undefined;

	return { accessToken, newRefreshToken }
}

export const verifyUser = async (code: string) => {
	const verificationDetails = await VerificationModel.findOne({ _id: code, type: VerificationType.EMAIL, expireDateTime: { $gte: Date.now() } })

	if (!verificationDetails)
		throw new AppError("Invalid or expired verification code", UNAUTHORIZED)

	const user = await UserModel.findByIdAndUpdate(verificationDetails.userId, { verified: true }, { new: true })

	if (!user)
		throw new AppError("User not exist", UNAUTHORIZED)

	await verificationDetails.deleteOne()

	return { ...user.toObject(), password: "****" }
}

export const getForgotPasswordEmailSetting = async (email: string) => {
	const user = await UserModel.findOne({ email });

	if (!user)
		throw new AppError("Invalid email", UNAUTHORIZED);

	// rate limit generating reset password code
	const existingResetPasswordCode = await VerificationModel.findOne({ userId: user._id, type: VerificationType.RESET_PASSWORD, createdDateTime: { $gte: Date.now() + 60 * 1000 } })

	if (existingResetPasswordCode)
		throw new AppError("Please retry after 1 minute", TOO_MANY_REQUESTS)

	const resetPasswordCode = await VerificationModel.create({
		userId: user._id,
		type: VerificationType.RESET_PASSWORD,
		expireDateTime: Date.now() + 1000 * 60 * 60
	})

	// await sendResetPasswordEmail(user.email, resetPasswordCode._id as string)

	return { email: user.email, resetPasswordCode }
}