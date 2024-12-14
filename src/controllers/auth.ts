// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Request, Response, NextFunction } from "express";
import withErrorControl from "../utils/withErrorControl"
import { registerSchema } from "../schemas/auth";
import { OK } from "../constants/httpStatus";
import { createAccount } from "../services/auth";

export const registerHandler = withErrorControl(async (req, res) => {
	const validRequest = registerSchema.parse({...req.body})

	const user = await createAccount(validRequest);

	res.status(OK).json(user)
	return
})