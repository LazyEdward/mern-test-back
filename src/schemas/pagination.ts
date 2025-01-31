// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { z } from "zod";
import { DEFAULT_PAGE_SIZE } from "../utils/pagination";

const sortSchema = z.object({
	name: z.string(),
	desc: z.boolean().optional().default(false),
})

export const paginationSchema = z.object({
	pageSize: z.number().gte(0).default(DEFAULT_PAGE_SIZE),
	page: z.number().gte(0),
	sortBy: z.array(sortSchema).optional()
})