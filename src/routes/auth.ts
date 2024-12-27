// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Router } from "express";
import { loginHandler, logoutHandler, registerHandler } from "../controllers/auth";

const authRoute = Router();

authRoute.post('/register', registerHandler);
authRoute.post('/login', loginHandler);
authRoute.post('/logout', logoutHandler);

export default authRoute;