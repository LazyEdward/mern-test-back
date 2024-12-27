// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import jwt from "jsonwebtoken"
import { JWT_SECRET, JWT_REfRESH_SECRET } from "../constants/env";

import VerificationType from "../constants/verificationType"
import SessionModel from "../models/session"
import UserModel from "../models/user"
import VerificationModel from "../models/verification"
import AppError from "../utils/AppError";
import { CONFLICT, UNAUTHORIZED } from "../constants/httpStatus";
import { get } from "mongoose";
import { getUserSessionToken } from "../utils/userSessionToken";

export type TAccountParam = {
	email: string,
	password: string,
}

export const createAccount = async(data: TAccountParam) => {
	const getUserFromEmail = await UserModel.exists({ email: data.email })

	if(!!getUserFromEmail)
		throw new AppError("Account already exists", CONFLICT)

	const newUser = await UserModel.create(data)

	const verificationCode = await VerificationModel.create({
		userId: newUser._id,
		type: VerificationType.EMAIL,
		expireDateTime: Date.now() + 1000 * 60 * 60 * 24
	})

	const session = await SessionModel.create({
		userId: newUser._id,
		expireDateTime: Date.now() + 1000 * 60 * 60 * 24
	})

	const userSessionToken = getUserSessionToken(session._id as string, newUser._id as string);

	return {user: {...newUser.toObject(), password: "****"}, ...userSessionToken}
}

export const login = async(data: TAccountParam) => {
	const user = await UserModel.findOne({ email: data.email })

	if(!user)
		throw new AppError("Invalid email or password", UNAUTHORIZED)

	const isValidPassword = await user.comparePassword(data.password)

	if(!isValidPassword)
		throw new AppError("Invalid email or password", UNAUTHORIZED)

	const session = await SessionModel.create({
		userId: user._id,
		expireDateTime: Date.now() + 1000 * 60 * 60 * 24
	})

	const userSessionToken = getUserSessionToken(session._id as string, user._id as string);

	return {user: {...user.toObject(), password: "****"}, ...userSessionToken}
}

export const cleanSession = async(sessionId: string) => {
	console.log("sessionId", sessionId)
	await SessionModel.findOneAndDelete({ _id: sessionId })
}