// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import { JWT_SECRET, JWT_REfRESH_SECRET } from "../constants/env";

type TSessionTokenDecoded = {
	userId?: any
	sessionId?: any,
	message?: string,
	status: "success" | "error",
}

export const getUserAccessToken = (userId: string, sessionId: string) => {
	const accessToken = jwt.sign({ userId, sessionId }, JWT_SECRET, { expiresIn: "5m" })
	return accessToken
}

export const getUserRefreshToken = (sessionId: string, longLived?: boolean) => {
	const refreshToken = jwt.sign({ sessionId }, JWT_REfRESH_SECRET, { expiresIn: longLived ? "30d" : "6h" })
	return refreshToken
}

export const getUserSessionToken = (sessionId: string, userId: string, longLived?: boolean) => {
	return { accessToken: getUserAccessToken(userId, sessionId), refreshToken: getUserRefreshToken(sessionId, longLived) }
}

const verifySessionToken = (token: string, secret: typeof JWT_SECRET | typeof JWT_REfRESH_SECRET): TSessionTokenDecoded => {
	try {
		const decoded = jwt.verify(token, secret) as { userId?: any, sessionId?: any }
		return { ...decoded, status: "success" }
	}
	catch (err: any) {
		let message = "Invalid token"
		if (err instanceof TokenExpiredError)
			message = "Token expired"

		return { status: "error", message }
	}
}

export const verifyAccessToken = (token: string) => verifySessionToken(token, JWT_SECRET)
export const verifyRefreshToken = (token: string) => verifySessionToken(token, JWT_REfRESH_SECRET)