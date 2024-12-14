// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Router } from "express";
import { registerHandler } from "../controllers/auth";

const authRoute = Router();

authRoute.post('/register', registerHandler);

export default authRoute;