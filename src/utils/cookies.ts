// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Response, CookieOptions } from "express";

const cookieOptions: CookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "strict",
}

export const setAuthCookie = (res: Response, accessToken: string, refreshToken?: string) => {
	res.cookie("accessToken", accessToken, { ...cookieOptions, expires: new Date(Date.now() + 1000 * 60 * 15) })

	if (refreshToken)
		res.cookie("refreshToken", refreshToken, { ...cookieOptions, path: "/auth/refresh", expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) })
}

export const clearAuthCookie = (res: Response) => {
	res.clearCookie("accessToken")
	res.clearCookie("refreshToken", { path: "/auth/refresh" })
}