// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import mongoose from "mongoose";
import { TTimestampDocument, getNumberTimestampSchema } from "../utils/numberTimestampSchema";
import ThreadModel from "./thread";

export type TPostDocument = {
	content: string,
	fromThread: mongoose.Types.ObjectId,
	createdUser: mongoose.Types.ObjectId,
	tag1?: string,
	tag2?: string,
	replyTo?: mongoose.Types.ObjectId,
	isHidden: boolean,
} & TTimestampDocument & mongoose.Document

const postSchema = getNumberTimestampSchema<TPostDocument>({
	content: { type: String, required: true },
	fromThread: { type: mongoose.Schema.Types.ObjectId, ref: "Thread", required: true, index: true },
	createdUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
	tag1: { type: String },
	tag2: { type: String },
	replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
	isHidden: { type: Boolean, default: false, required: true }
})

postSchema.post('save', async function (doc, next) {
	const tid = doc.fromThread;

	const thread = await ThreadModel.findById(tid);

	if (!thread)
		throw Error('Thread does not exists')

	thread.lastModified = Date.now();
	await thread.save()
	return next();
});

const PostModel = mongoose.model<TPostDocument>('Post', postSchema);

export default PostModel