// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { BAD_REQUEST, CONFLICT, OK, UNAUTHORIZED } from "../constants/httpStatus";
import { TPostDocument } from "../models/post";
import { TThreadDocument } from "../models/thread";
import { postCreateSchema, postDeleteSchema, postsInThreadSearchSchema, postUpdateSchema, threadCreateSchema, threadUpdateSchema } from "../schemas/thread";
import { createPost, createThread, deletePost, getPost, getPostByThreadId, getThread, updatePost, updateThread } from "../services/thread";
import AppError from "../utils/AppError";
import defaultHandler from "../utils/defaultHandler";
import { DEFAULT_PAGE_SIZE, OLD_TO_NEW } from "../utils/pagination";

export const dashBoardHandler = defaultHandler(async (req, res) => {
	const { userId } = req.body.auth;
	const lastUpdated = Date.now();

	res.status(OK).json({
		lastUpdated
	})
	return
})

export const createThreadHandler = defaultHandler(async (req, res) => {
	const { userId } = req.body.auth;
	const vaildRequest = threadCreateSchema.parse({ ...req.body, host: userId })
	const thread = await createThread(vaildRequest)

	res.status(OK).json(thread);
	return
})

export const updateThreadHandler = defaultHandler(async (req, res) => {
	const { userId } = req.body.auth;
	const vaildRequest = threadUpdateSchema.parse({ ...req.body, host: userId })
	const thread = await updateThread(vaildRequest)

	res.status(OK).json(thread);
	return
})

export const createPostHandler = defaultHandler(async (req, res) => {
	const { userId } = req.body.auth;
	const vaildRequest = postCreateSchema.parse({ ...req.body, createdUser: userId })
	const thread = await createPost(vaildRequest)

	res.status(OK).json(thread);
	return
})

export const updatePostHandler = defaultHandler(async (req, res) => {
	const { userId } = req.body.auth;
	const vaildRequest = postUpdateSchema.parse({ ...req.body, updateUser: userId })
	const post = await updatePost(vaildRequest)

	res.status(OK).json(post);
	return
})

export const deletePostHandler = defaultHandler(async (req, res) => {
	const { userId } = req.body.auth;
	const vaildRequest = postDeleteSchema.parse({ ...req.body })

	await deletePost(vaildRequest.id, userId)

	res.status(OK).json({ message: "Remove post successfully" });
	return
})

export const getThreadHandler = defaultHandler(async (req, res) => {
	const { userId } = req.body.auth;

	if (!req.params.id)
		throw new AppError("Invalid Input", BAD_REQUEST)

	const thread = await getThread(req.params.id)
	const threadObject: Partial<TThreadDocument> = thread.toObject()

	if (!userId) {
		if (!threadObject.isPublicViewable)
			throw new AppError("Permission denied", UNAUTHORIZED)
		delete threadObject.host
	}

	res.status(OK).json(threadObject);
	return
})

export const getPostHandler = defaultHandler(async (req, res) => {
	const { userId } = req.body.auth;

	if (!req.params.id)
		throw new AppError("Invalid input", CONFLICT);

	const post = await getPost(req.params.id)
	const postObject: Partial<TPostDocument> = post.toObject()

	if (postObject.isHidden && postObject.createdUser !== userId)
		postObject.content = "****"

	if (!userId)
		delete postObject.createdUser

	res.status(OK).json(postObject);
	return
})

export const getPostsHandler = defaultHandler(async (req, res) => {
	const { userId } = req.body.auth;

	const vaildRequest = postsInThreadSearchSchema.parse({ threadId: req.params.threadId, page: req.query.page })
	const posts: Partial<TPostDocument>[] = await getPostByThreadId(vaildRequest.threadId, {
		page: vaildRequest.page,
		pageSize: DEFAULT_PAGE_SIZE,
		sortBy: [OLD_TO_NEW]
	})

	let threadObject: Partial<TThreadDocument> | null = null;

	if (vaildRequest.includeThread) {
		const thread = await getThread(vaildRequest.threadId)
		threadObject = thread.toObject()

		if (!userId) {
			if (!threadObject.isPublicViewable)
				throw new AppError("Permission denied", UNAUTHORIZED)
			delete threadObject.host
		}
	}

	posts.forEach(post => {
		if (post.isHidden && post.createdUser !== userId)
			post.content = "****"

		if (!userId)
			delete post.createdUser
	})

	res.status(OK).json({ thread: threadObject, posts });
	return
})
