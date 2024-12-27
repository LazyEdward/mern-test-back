// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import mongoose from "mongoose";
import { TCreatedTimestampDocument } from "../utils/numberTimestampSchema";

export type TSessionDocument = {
	userId: mongoose.Types.ObjectId,
	expireDateTime: number,
} & TCreatedTimestampDocument & mongoose.Document

const sessionSchema = new mongoose.Schema<TSessionDocument>({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
	expireDateTime: { type: Number, required: true },
})

const SessionModel = mongoose.model<TSessionDocument>('Session', sessionSchema);

export default SessionModel