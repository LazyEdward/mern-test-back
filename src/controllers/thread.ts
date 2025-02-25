// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { BAD_REQUEST, CONFLICT, OK, UNAUTHORIZED } from "../constants/httpStatus";
import { TPostDocument } from "../models/post";
import { THREAD_TOPICS, TThreadDocument } from "../models/thread";
import { postCreateDataOnlySchema, postCreateSchema, postDeleteSchema, postsInThreadSearchSchema, postUpdateSchema, threadByTopicSchema, threadCreateSchema, threadUpdateSchema } from "../schemas/thread";
import { createPost, createThread, createThreadAndPost, deletePost, getPost, getPostsByThreadId, getThread, getThreadByTopic, updatePost, updateThread } from "../services/thread";
import AppError from "../utils/AppError";
import defaultHandler from "../utils/defaultHandler";
import { DASHBOARD_PAGE_SIZE, DEFAULT_PAGE_SIZE, NEW_TO_OLD, OLD_TO_NEW } from "../utils/pagination";

export const dashBoardHandler = defaultHandler(async (req, res) => {
	const { userId } = req.body.auth;
	const lastUpdated = Date.now();

	let topics: Record<string, Partial<TThreadDocument>[]> = {}
	let topicsPromises: Promise<Partial<TThreadDocument>[]>[] = []

	for (let topic of THREAD_TOPICS) {
		topicsPromises.push(getThreadByTopic({ topic, publicAccess: !userId }, {
			page: 0,
			pageSize: DASHBOARD_PAGE_SIZE,
			sortBy: [NEW_TO_OLD]
		}))
	}

	let topicsArray = await Promise.all(topicsPromises)

	for (let i = 0; i < THREAD_TOPICS.length; i++)
		topics[THREAD_TOPICS[i]] = topicsArray[i]

	res.status(OK).json({
		lastUpdated,
		topics
	})
	return
})

export const createThreadHandler = defaultHandler(async (req, res) => {
	const { userId } = req.body.auth;
	const { post, ...threadData } = threadCreateSchema.parse({ ...req.body, host: userId })

	let thread: {} | null = null;

	if (!!post) {
		const postData = postCreateDataOnlySchema.parse(post)
		thread = await createThreadAndPost(threadData, postData)
	}
	else
		thread = await createThread(threadData)

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

export const getThreadByTopicHandler = defaultHandler(async (req, res) => {
	const { userId } = req.body.auth;
	const lastUpdated = Date.now();

	const vaildRequest = threadByTopicSchema.parse({ topic: req.params.topic, subTopic: req.query.subTopic })
	const threads: Partial<TThreadDocument>[] = await getThreadByTopic({ ...vaildRequest, publicAccess: !userId }, {
		page: 0,
		pageSize: DEFAULT_PAGE_SIZE,
		sortBy: [NEW_TO_OLD]
	})

	res.status(OK).json({ lastUpdated, threads })
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
	const lastUpdated = Date.now();

	const vaildRequest = postsInThreadSearchSchema.parse({ threadId: req.params.threadId, page: req.query.page, includeThread: !!req.query.includeThread })
	const posts: Partial<TPostDocument>[] = await getPostsByThreadId(vaildRequest.threadId, {
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

	res.status(OK).json({ thread: threadObject, lastUpdated, posts });
	return
})
