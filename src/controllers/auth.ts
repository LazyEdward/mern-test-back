// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { OK } from "../constants/httpStatus";
import { loginSchema, registerSchema } from "../schemas/auth";
import { cleanSession, createAccount, login } from "../services/auth";
import { clearAuthCookie, setAuthCookie } from "../utils/cookies";
import defaultHandler from "../utils/defaultHandler";
import { verifySessionToken } from "../utils/userSessionToken";

export const registerHandler = defaultHandler(async (req, res) => {
	const validRequest = registerSchema.parse({...req.body})

	const {user, accessToken, refreshToken} = await createAccount(validRequest);

	setAuthCookie(res, accessToken, refreshToken);
	res.status(OK).json(user);
	
	return
})

export const loginHandler = defaultHandler(async (req, res) => {
	const validRequest = loginSchema.parse({...req.body})

	const {user, accessToken, refreshToken} = await login(validRequest);

	setAuthCookie(res, accessToken, refreshToken);
	res.status(OK).json(user);
	
	return
})

export const logoutHandler = defaultHandler(async (req, res) => {
	const payload = verifySessionToken(req.cookies.accessToken);

	if(!!payload)
		await cleanSession(payload.sessionId);

	clearAuthCookie(res);
	res.status(OK).json({message: "Logged out successfully"})
	
	return
})