// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Router } from "express";
import { dashBoardHandler, getPostHandler, getPostsHandler, getThreadByTopicHandler, getThreadHandler } from "../controllers/thread";

const publicRoute = Router();

publicRoute.get('/', dashBoardHandler)											// dashboard data contain recently updated 3 threads from each topic
publicRoute.get('/threads/:topic', getThreadByTopicHandler)	// get recently updated 20 threads by topic and/or sub topic
publicRoute.get('/thread/:id/get', getThreadHandler)				// get thread by id
publicRoute.get('/posts/:threadId', getPostsHandler)				// get posts by thread id, optionally include thread
publicRoute.get('/post/:id/get', getPostHandler)

export default publicRoute;