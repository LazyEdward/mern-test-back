// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ErrorRequestHandler, Response } from "express"
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpStatus"
import { ZodError } from "zod";
import AppError from "../utils/AppError";
import { clearAuthCookie } from "../utils/cookies";

const handleInputError = (res: Response, err: ZodError) => {
	const errors = err.issues.map((err) => ({
		path: err.path.join("."),
		message: err.message,
	}));

	// debug message
	// console.log(JSON.stringify(errors, null, 4))

	res.status(BAD_REQUEST).json({
		// errors,
		message: "Invalid input",
	});

	return
};

const handleApplicationError = (res: Response, err: AppError) => {
	res.status(err.statusCode).json({
		message: err.message
	})
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	console.log(`ERROR ACCESSING PATH: ${req.path}`, `message: ${err.message}`)

	// clear cookies
	if (req.path === "/auth/refresh" || req.path === "/auth/logout")
		clearAuthCookie(res)

	// input errors
	if (err instanceof ZodError) {
		handleInputError(res, err)
		return
	}

	// application errors
	if (err instanceof AppError) {
		handleApplicationError(res, err)
		return
	}

	res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error")
}

export default errorHandler