// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { z } from "zod"
import { THREAD_TOPICS } from "../models/thread"
import { paginationSchema } from "./pagination"

const tagSchema = z.string().regex(/^\#\w+/)

const threadInputSchema = z.object({
	topic: z.enum(THREAD_TOPICS).optional(),
	subTopic: z.string().optional(),
	title: z.string().trim().min(6).max(100).optional(),
	host: z.string().length(24),
	isPublicViewable: z.boolean().optional(),
})

const postInputSchema = z.object({
	content: z.string().min(1).max(500).optional(),
	tag1: tagSchema.optional(),
	tag2: tagSchema.optional(),
	replyTo: z.string().length(24).optional(),
	isHidden: z.boolean().optional(),
})

export const threadCreateSchema = threadInputSchema.extend({
	topic: z.enum(THREAD_TOPICS),
	title: z.string().trim().min(6).max(100),
	isPublicViewable: z.boolean().optional().default(false),
	post: postInputSchema.extend({
		content: z.string().min(1).max(500),
		isHidden: z.boolean().optional().default(false),
	}).optional()
})

export const threadUpdateSchema = threadInputSchema.extend({
	id: z.string().length(24),
})

export const threadByTopicSchema = z.object({
	topic: z.enum(THREAD_TOPICS),
	subTopic: z.string().optional(),
	currentThreadId: z.string().length(24).optional(),
})

export const threadSearchSchema = z.object({
	fields: threadInputSchema.extend({
		id: z.string().length(24).optional(),
	}),
	setting: paginationSchema
})

export const postCreateDataOnlySchema = postInputSchema.extend({
	content: z.string().min(1).max(500),
	isHidden: z.boolean().optional().default(false),
})

export const postCreateSchema = postInputSchema.extend({
	content: z.string().min(1).max(500),
	fromThread: z.string().length(24),
	createdUser: z.string().length(24),
	isHidden: z.boolean().optional().default(false),
})

export const postUpdateSchema = postInputSchema.extend({
	id: z.string().length(24),
	updateUser: z.string().length(24),
})

export const postDeleteSchema = z.object({
	id: z.string().length(24),
})


export const postSearchSchema = z.object({
	fields: postInputSchema.extend({
		id: z.string().length(24).optional(),
		fromThread: z.string().length(24).optional(),
		createdUser: z.string().length(24).optional(),
	}),
	setting: paginationSchema
})

export const postsInThreadSearchSchema = z.object({
	threadId: z.string().length(24),
	includeThread: z.boolean().optional().default(false),
	page: z.number().gte(0).optional().default(0),
})