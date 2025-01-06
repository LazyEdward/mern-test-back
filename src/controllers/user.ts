// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { OK } from "../constants/httpStatus";
import { getActiveSessionCounts, getUserInfo, removeOtherSessions } from "../services/user";
import defaultHandler from "../utils/defaultHandler";

export const userInfo = defaultHandler(async (req, res) => {
	const { userId } = req.body.auth;
	const user = await getUserInfo(userId);

	res.status(OK).json(user);
	return
})

export const sessionCount = defaultHandler(async (req, res) => {
	const { userId } = req.body.auth;
	const count = await getActiveSessionCounts(userId);

	res.status(OK).json({ activeSessions: count });
	return
})

export const logoutOthers = defaultHandler(async (req, res) => {
	const { userId, sessionId } = req.body.auth;
	await removeOtherSessions(userId, sessionId);

	res.status(OK).json({ message: "Logged out other sessions successfully" });
	return

})