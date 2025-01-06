// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Router } from "express";
import { logoutOthers, sessionCount, userInfo } from "../controllers/user";

const protectedRoute = Router();

protectedRoute.get('/user', userInfo)
protectedRoute.get('/session/count', sessionCount)
protectedRoute.post('/session/logout/others', logoutOthers)

export default protectedRoute;