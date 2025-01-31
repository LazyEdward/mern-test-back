// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import mongoose from "mongoose";
import { TTimestampDocument, getNumberTimestampSchema } from "../utils/numberTimestampSchema";

export const THREAD_TOPICS = ['anime', 'manga', 'novel', 'game', 'vtuber'] as const

export type TThreadDocument = {
	topic: typeof THREAD_TOPICS[number],
	subTopic?: string,
	title: string,
	host: mongoose.Types.ObjectId,
	isPublicViewable: boolean,
} & TTimestampDocument & mongoose.Document

const threadSchema = getNumberTimestampSchema<TThreadDocument>({
	title: { type: String, required: true },
	subTopic: { type: String },
	topic: { type: String, required: true },
	host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
	isPublicViewable: { type: Boolean, default: false, required: true },
})

const ThreadModel = mongoose.model<TThreadDocument>('Thread', threadSchema);

export default ThreadModel