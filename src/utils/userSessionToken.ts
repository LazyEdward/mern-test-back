// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import jwt from "jsonwebtoken"
import { JWT_SECRET, JWT_REfRESH_SECRET } from "../constants/env";

export const getUserSessionToken = (sessionId: string, userId: string) => {
	const refreshToken = jwt.sign({ sessionId }, JWT_REfRESH_SECRET, { expiresIn: "30d" })
	const accessToken = jwt.sign({ userId, sessionId }, JWT_SECRET, { expiresIn: "5m" })

	return { accessToken, refreshToken }
}

export const verifySessionToken = (token: string) => {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as {sessionId:any}
		return decoded
	}
	catch (err: any) {
		return err.message
	}
}