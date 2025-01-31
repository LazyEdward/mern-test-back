// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Router } from "express";
import { logoutOthers, sessionCount, userInfo } from "../controllers/user";
import { createPostHandler, createThreadHandler, deletePostHandler, updatePostHandler, updateThreadHandler } from "../controllers/thread";

const protectedRoute = Router();

protectedRoute.get('/user', userInfo)
protectedRoute.get('/session/count', sessionCount)
protectedRoute.post('/session/logout/others', logoutOthers)

protectedRoute.post('/thread/create', createThreadHandler)
protectedRoute.post('/thread/update', updateThreadHandler)
protectedRoute.post('/post/create', createPostHandler)
protectedRoute.post('/post/update', updatePostHandler)
protectedRoute.post('/post/delete', deletePostHandler)

export default protectedRoute;