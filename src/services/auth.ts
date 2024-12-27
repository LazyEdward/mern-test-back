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

export type TAccountParam = {
	email: string,
	password: string,
}

export const createAccount = async(data: TAccountParam) => {
	const getUserFromEmail = await UserModel.exists({ email: data.email })

	if(!!getUserFromEmail)
		throw new Error("Account already exists")

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

	const refreshToken = jwt.sign({ sessionId: session._id }, JWT_REfRESH_SECRET, { expiresIn: "30d" })
	const accessToken = jwt.sign({ userId: newUser._id, sessionId: session._id }, JWT_SECRET, { expiresIn: "5m" })

	return {user: newUser, accessToken, refreshToken}
}