// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import mongoose from "mongoose";
import getNumberTimestampSchema, { setTimestamp, TtimestampDocument } from "../utils/numberTimestampSchema";
import { checkEncryption, encrypt } from "../utils/encrypt";

export type TUserDocument = {
	email: string,
	password: string,
	verified: boolean,
	comparePassword: (password: string) => Promise<boolean>
} & TtimestampDocument & mongoose.Document

const userSchema = getNumberTimestampSchema<TUserDocument>({
	email: { type: String, unique: true, required: true},
	password: { type: String, required: true},
	verified: { type: Boolean, default: false, required: true},
})

userSchema.pre("save", async function (next) {
	const user = this;
	setTimestamp(user)

  if(!user.isModified("password")) {
    return next();
  }

  user.password = await encrypt(user.password);
  return next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return checkEncryption(password, this.password);
};

const UserModel = mongoose.model('User', userSchema);
export default UserModel