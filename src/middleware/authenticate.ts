// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { RequestHandler } from "express";
import AppError from "../utils/AppError";
import { FORBIDDEN, UNAUTHORIZED } from "../constants/httpStatus";
import { verifyAccessToken } from "../utils/userSessionToken";

export const optionalAuthenticationHandler: RequestHandler = (req, res, next) => {
	const accessToken = req.cookies.accessToken;

	req.body.auth = {}

	if (!accessToken) {
		next()
		return
	}

	const payload = verifyAccessToken(accessToken);

	if (!payload || payload.status === "error") {
		next()
		return
	}

	if (payload.status === "expired") {
		next()
		return
	}

	req.body.auth.sessionId = payload.sessionId
	req.body.auth.userId = payload.userId

	next()
};

export const authenticationHandler: RequestHandler = (req, res, next) => {
	const accessToken = req.cookies.accessToken;

	if (!accessToken)
		throw new AppError("Not authorized", UNAUTHORIZED)

	const payload = verifyAccessToken(accessToken);

	if (!payload || payload.status === "error")
		throw new AppError("Not authorized", UNAUTHORIZED)

	if (payload.status === "expired")
		throw new AppError("Session Expired", FORBIDDEN)

	req.body.auth = {}
	req.body.auth.sessionId = payload.sessionId
	req.body.auth.userId = payload.userId

	next()
};