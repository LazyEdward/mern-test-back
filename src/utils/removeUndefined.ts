// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const removeUndefined = (data: Record<string, any>) => {
	let newData = { ...data }

	for (let key in newData) {
		if (newData[key] === undefined)
			delete newData[key]
	}

	return newData
}

export default removeUndefined