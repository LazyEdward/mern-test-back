// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import mongoose from "mongoose";
import { TTimestampDocument, getNumberTimestampSchema } from "../utils/numberTimestampSchema";
import { checkEncryption, encrypt } from "../utils/encrypt";

export type TUserDocument = {
	email: string,
	password: string,
	verified: boolean,
	comparePassword: (password: string) => Promise<boolean>
} & TTimestampDocument & mongoose.Document

const userSchema = getNumberTimestampSchema<TUserDocument>({
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	verified: { type: Boolean, default: false, required: true },
})

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}

	this.password = await encrypt(this.password);
	return next();
});

userSchema.methods.comparePassword = async function (password: string) {
	return checkEncryption(password, this.password);
};

const UserModel = mongoose.model('User', userSchema);
export default UserModel