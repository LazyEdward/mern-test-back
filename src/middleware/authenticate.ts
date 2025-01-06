// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { RequestHandler } from "express";
import AppError from "../utils/AppError";
import { UNAUTHORIZED } from "../constants/httpStatus";
import { verifyAccessToken } from "../utils/userSessionToken";

const authenticationHandler: RequestHandler = (req, res, next) => {
	const accessToken = req.cookies.accessToken;

	if (!accessToken)
		throw new AppError("Not authorized", UNAUTHORIZED)

	const payload = verifyAccessToken(accessToken);

	if (!payload || payload.status === "error")
		throw new AppError("Not authorized", UNAUTHORIZED)

	// console.log("AUTHENTICATION PAYLOAD", payload)

	req.body.auth = {}
	req.body.auth.sessionId = payload.sessionId
	req.body.auth.userId = payload.userId

	// console.log("AUTHENTICATION REQ BODY", req.body)

	next()
};

export default authenticationHandler