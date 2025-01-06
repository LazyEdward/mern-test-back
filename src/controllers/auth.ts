// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { OK, UNAUTHORIZED } from "../constants/httpStatus";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, verifyUserSchema } from "../schemas/auth";
import { cleanSession, createAccount, login, refreshSession, getForgotPasswordEmailSetting, updateUserPassword, verifyUser } from "../services/auth";
import AppError from "../utils/AppError";
import { clearAuthCookie, setAuthCookie } from "../utils/cookies";
import defaultHandler from "../utils/defaultHandler";
import { sendResetPasswordEmail, sendVerificationEmail } from "../utils/email";
import { verifyAccessToken } from "../utils/userSessionToken";

export const registerHandler = defaultHandler(async (req, res) => {
	const validRequest = registerSchema.parse({ ...req.body })

	const { user, accessToken, refreshToken, verificationCode } = await createAccount(validRequest);

	setAuthCookie(res, accessToken, refreshToken);
	res.status(OK).json(user);
	res.on("finish", () => {
		sendVerificationEmail(user.email, verificationCode._id as string)
	})

	return
})

export const loginHandler = defaultHandler(async (req, res) => {
	const validRequest = loginSchema.parse({ ...req.body })

	const { user, accessToken, refreshToken } = await login(validRequest);

	setAuthCookie(res, accessToken, refreshToken);
	res.status(OK).json(user);

	return
})

export const logoutHandler = defaultHandler(async (req, res) => {
	const payload = verifyAccessToken(req.cookies.accessToken);

	if (payload.status === "success")
		await cleanSession(payload.sessionId);

	clearAuthCookie(res);
	res.status(OK).json({ message: "Logged out successfully" })

	return
})

export const refreshSessionHandler = defaultHandler(async (req, res) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken)
		throw new AppError("Missing refresh token", UNAUTHORIZED)

	const { accessToken, newRefreshToken } = await refreshSession(refreshToken)
	setAuthCookie(res, accessToken, newRefreshToken);

	res.status(OK).json({ message: "Session refreshed" })
	return
})

export const verifyUserHandler = defaultHandler(async (req, res) => {
	const validRequest = verifyUserSchema.parse({ ...req.body })

	await verifyUser(validRequest.code);

	res.status(OK).json({ message: "User Email verified" })
	return
})

export const forgotPasswordHandler = defaultHandler(async (req, res) => {
	const validRequest = forgotPasswordSchema.parse({ ...req.body })

	const { email, resetPasswordCode } = await getForgotPasswordEmailSetting(validRequest.email);

	res.status(OK).json({ message: "Password reset email sent" })
	res.on("finish", () => {
		sendResetPasswordEmail(email, resetPasswordCode._id as string)
	})
	return
})

export const resetPasswordHandler = defaultHandler(async (req, res) => {
	// with reset password code
	// const validRequest = resetPasswordWithCodeSchema.parse({ ...req.body })

	// without reset password code
	const validRequest = resetPasswordSchema.parse({ ...req.body })

	await updateUserPassword(validRequest);

	clearAuthCookie(res);
	res.status(OK).json({ message: "Password successfully reset. Please login with new password" })
	return
})