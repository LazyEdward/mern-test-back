// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { HttpStatusCode } from "../constants/httpStatus";

class AppError extends Error {
	constructor(public message: string, public statusCode: HttpStatusCode) {
		super(message);
	}
}

export default AppError;