// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { OK } from "../constants/httpStatus";
import { registerSchema } from "../schemas/auth";
import { createAccount } from "../services/auth";
import { setAuthCookie } from "../utils/cookies";
import defaultHandler from "../utils/defaultHandler";

export const registerHandler = defaultHandler(async (req, res) => {
	const validRequest = registerSchema.parse({...req.body})

	const {user, accessToken, refreshToken} = await createAccount(validRequest);

	setAuthCookie(res, accessToken, refreshToken);
	res.status(OK).json(user);
	
	return
})