// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Router } from "express";
import { forgotPasswordHandler, loginHandler, logoutHandler, refreshSessionHandler, registerHandler, resetPasswordHandler, verifyUserHandler } from "../controllers/auth";
import authReqLimiter from "../utils/rateLimiter";

const authRoute = Router();

authRoute.use(authReqLimiter)

authRoute.post('/register', registerHandler);
authRoute.post('/login', loginHandler);
authRoute.post('/logout', logoutHandler);
authRoute.post('/refresh', refreshSessionHandler);
authRoute.post('/verify', verifyUserHandler);
authRoute.post('/password/forgot', forgotPasswordHandler);
authRoute.post('/password/reset', resetPasswordHandler);

export default authRoute;