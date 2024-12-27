// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { z } from "zod"

const emailSchema = z.string().email().min(1).max(255)
const passwordSchema = z.string().min(8).max(255)

export const registerSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"],
})

export const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
})