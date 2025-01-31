// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { TSortParam } from "./pagination"

export const searchSortConvertion = (sortBy: TSortParam[]) => {
	return sortBy.reduce((sortObj, item) => ({ ...sortObj, [item.name]: item.desc ? -1 : 1 }), {})
}

export const toSearchString = (searchString: string | number) => {
	return { $regex: new RegExp(`^${searchString}`) }
}