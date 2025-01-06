// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { UNAUTHORIZED } from "../constants/httpStatus";
import SessionModel from "../models/session";
import UserModel from "../models/user"
import AppError from "../utils/AppError";

export const getUserInfo = async (userId: string) => {
	const user = await UserModel.findById(userId);

	if (!user)
		throw new AppError("User not exist", UNAUTHORIZED)

	return { ...user.toObject(), password: "****" }
}

export const getActiveSessionCounts = async (userId: string) => {
	return await SessionModel.countDocuments({ userId, expireDateTime: { $gt: Date.now() } });
}

export const removeOtherSessions = async (userId: string, sessionId: string) => {
	await SessionModel.deleteMany({ userId, _id: { $ne: sessionId } });
}