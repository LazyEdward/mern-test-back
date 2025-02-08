// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export const DASHBOARD_PAGE_SIZE = 3
export const DEFAULT_PAGE_SIZE = 20

export type TSortParam = {
	name: string,
	desc: boolean,
}

export const OLD_TO_NEW = { name: "createdDateTime", desc: false } as const satisfies TSortParam
export const NEW_TO_OLD = { name: "lastModified", desc: true } as const satisfies TSortParam

export type TPagination = {
	pageSize: number,
	page: number,
	sortBy: TSortParam[]
}
