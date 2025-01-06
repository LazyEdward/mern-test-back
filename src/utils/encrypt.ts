// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import bcrypt from "bcrypt"

export const encrypt = async (value: string) => bcrypt.hash(value, 10)
export const checkEncryption = async (value: string, encryptedValue: string) => bcrypt.compare(value, encryptedValue).catch(() => false)