// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import UserModel from "../models/user"

export type TAccountParam = {
	email: string,
	password: string,
}

export const createAccount = async(data: TAccountParam) => {
	const getUserFromEmail = await UserModel.exists({ email: data.email })

	if(!!getUserFromEmail)
		throw new Error("Account already exists")

	const newUser = await UserModel.create(data)

	return {user: newUser}
}