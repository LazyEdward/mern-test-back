// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import mongoose from "mongoose";
import VerificationType from "../constants/verificationType";
import { TCreatedTimestampDocument } from "../utils/numberTimestampSchema";

export type TVerificationDocument = {
	userId: mongoose.Types.ObjectId,
	type: VerificationType,
	expireDateTime: number,
} & TCreatedTimestampDocument & mongoose.Document

const verificationSchema = new mongoose.Schema<TVerificationDocument>({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
	type: { type: String, required: true },
	expireDateTime: { type: Number, required: true },
})

const VerificationModel = mongoose.model<TVerificationDocument>('Verification', verificationSchema);

export default VerificationModel