// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import mongoose from "mongoose";
import { CONFLICT, UNAUTHORIZED } from "../constants/httpStatus";
import PostModel from "../models/post";
import ThreadModel, { THREAD_TOPICS } from "../models/thread";
import AppError from "../utils/AppError";
import { TPagination } from "../utils/pagination";
import { searchSortConvertion } from "../utils/searchAndSort";
import removeUndefined from "../utils/removeUndefined";

export type TThreadTopicParam = {
	topic: typeof THREAD_TOPICS[number],
	subTopic?: string,
}

export type TThreadParam = {
	title: string,
	host: string,
	isPublicViewable: boolean,
} & TThreadTopicParam

export type TThreadCreateParam = TThreadParam

export type TThreadSearchParam = {
	publicAccess: boolean,
	fields: Omit<Partial<TThreadParam>, 'title'> & { id?: string, title?: string | { $regex: RegExp } }
	setting: TPagination
}

export type TThreadTopicSearchParam = {
	publicAccess: boolean,
	currentThreadId?: string,
} & TThreadTopicParam

export type TThreadUpdateParam = Partial<TThreadParam> & { id: string }

export type TPostParam = {
	content: string,
	tag1?: string,
	tag2?: string,
	replyTo?: string,
	isHidden?: boolean,
}

export type TPostCreateParam = TPostParam & {
	fromThread: string,
	createdUser: string,
}

export type TPostSearchParam = {
	publicAccess: boolean,
	fields: Omit<Partial<TPostParam>, 'content'> & {
		fromThread?: string,
		createdUser?: string,
		tags?: string[],
		content?: string | { $regex: RegExp }
	},
	setting: TPagination
}

export type TPostUpdateParam = Partial<TPostParam> & { id: string, updateUser: string }

export const createThread = async (data: TThreadCreateParam) => {
	const thread = await ThreadModel.findOne({ topic: data.topic, title: data.title.trim() })

	if (!!thread)
		throw new AppError("Title already exists", CONFLICT)

	const newThread = await ThreadModel.create(removeUndefined(data))

	return newThread
}

export const createThreadAndPost = async (threadData: TThreadCreateParam, postData: Omit<TPostParam, "replyTo">) => {
	const thread = await ThreadModel.findOne({ topic: threadData.topic, title: threadData.title.trim() })

	if (!!thread)
		throw new AppError("Title already exists", CONFLICT)

	const newThread = await ThreadModel.create(removeUndefined(threadData))
	await PostModel.create(removeUndefined({ ...postData, createdUser: threadData.host, fromThread: newThread.toObject()._id }))

	return newThread
}

export const updateThread = async (data: TThreadUpdateParam) => {
	const thread = await ThreadModel.findById(data.id)

	if (!thread)
		throw new AppError("Thread does not exists", CONFLICT)

	if (thread.host.toString() !== data.host)
		throw new AppError("Permission denied", UNAUTHORIZED)

	if (data.topic)
		thread.topic = data.topic

	thread.subTopic = data?.subTopic

	if (data.title)
		thread.title = data.title.trim()

	if (data.topic || data.title) {
		const searchThread = await ThreadModel.findOne({ _id: { $ne: data.id }, topic: thread.topic, title: thread.title })

		if (!!searchThread)
			throw new AppError("Title already exists", CONFLICT)
	}

	if (data.isPublicViewable)
		thread.isPublicViewable = data.isPublicViewable

	await thread.save()

	return thread
}

export const getThread = async (id: string) => {
	const thread = await ThreadModel.findById(id)

	if (!thread)
		throw new AppError("Thread does not exists", CONFLICT)

	return thread
}

export const getThreadByTopic = async (data: TThreadTopicSearchParam, setting: TPagination) => {
	const { currentThreadId, publicAccess, ...rest } = data

	let searchObj: Record<string, any> = removeUndefined(rest);

	// look for records older than current thread
	if (currentThreadId)
		searchObj._id = currentThreadId

	// exclude threads public access (non logged in users)
	if (publicAccess)
		searchObj.isPublicViewable = true

	return await ThreadModel.find(searchObj).sort(searchSortConvertion(setting.sortBy)).skip(setting.page * setting.pageSize).limit(setting.pageSize)
}

export const createPost = async (data: TPostCreateParam) => {
	if (data.replyTo) {
		const post = await PostModel.findById(data.replyTo)

		if (!post)
			throw new AppError("Reply Post does not exists", CONFLICT)

	}

	return await PostModel.create(removeUndefined(data))
}

export const updatePost = async (data: TPostUpdateParam) => {
	const post = await PostModel.findById(data.id)

	if (!post)
		throw new AppError("Post does not exists", CONFLICT)

	if (post.createdUser.toString() !== data.updateUser) {
		const thread = await ThreadModel.findById(post.fromThread);

		if (!thread || thread.host.toString() !== data.updateUser)
			throw new AppError("Permission denied", UNAUTHORIZED)
	}

	if (data.replyTo) {
		const rePlyPost = await PostModel.findById(data.replyTo)

		if (!rePlyPost)
			throw new AppError("Reply Post does not exists", CONFLICT)
	}

	if (data.content)
		post.content = data.content

	post.tag1 = data?.tag1
	post.tag2 = data?.tag2

	post.replyTo = data?.replyTo ? new mongoose.Types.ObjectId(data?.replyTo) : undefined

	if (data.isHidden)
		post.isHidden = data.isHidden

	await post.save();

	return post
}

export const getPost = async (id: string) => {
	const post = await PostModel.findById(id)

	if (!post)
		throw new AppError("Post does not exists", CONFLICT)

	return post
}

export const getPostsByThreadId = async (id: string, setting: TPagination) => {
	return await PostModel.find({ fromThread: id }).sort(searchSortConvertion(setting.sortBy)).skip(setting.page * setting.pageSize).limit(setting.pageSize)
}

export const deletePost = async (id: string, userId: string) => {
	const post = await getPost(id)
	const thread = await ThreadModel.findById(post.fromThread);

	if (!thread)
		throw new AppError("Thread does not exists", CONFLICT)

	if (thread.host.toString() !== userId)
		throw new AppError("Permission denied", UNAUTHORIZED)

	await post.deleteOne()
	return true
}