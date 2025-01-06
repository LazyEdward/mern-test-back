// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import mongoose from "mongoose";
import { TCreatedTimestampDocument } from "../utils/numberTimestampSchema";

export type TSessionDocument = {
	userId: mongoose.Types.ObjectId,
	expireDateTime: number,
	longLived?: boolean,
	isExpiring: () => Promise<boolean>,
	extendSession: () => Promise<void>
} & TCreatedTimestampDocument & mongoose.Document

const sessionSchema = new mongoose.Schema<TSessionDocument>({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
	expireDateTime: { type: Number, required: true },
	longLived: { type: Boolean, default: false }
})

sessionSchema.methods.isExpiring = async function () {
	return this.expireDateTime < Date.now() + 1000 * 60 * 60 * 24
}

sessionSchema.methods.extendSession = async function () {
	this.expireDateTime = this.longLived ? Date.now() + 1000 * 60 * 60 * 24 * 30 : Date.now() + 1000 * 60 * 60 * 6
	await this.save()
}

const SessionModel = mongoose.model<TSessionDocument>('Session', sessionSchema);

export default SessionModel