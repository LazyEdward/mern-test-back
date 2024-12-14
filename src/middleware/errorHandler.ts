// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ErrorRequestHandler, Response } from "express"
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpStatus"
import { z, ZodError } from "zod";

const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));

  res.status(BAD_REQUEST).json({
    errors,
    message: error.message,
  });

	return
};

const errorHandler : ErrorRequestHandler = (err, req, res, next) => {
	console.log(`ERROR ACCESSING PATH: ${req.path}`, err)

	// input errors
	if(err instanceof ZodError){
		handleZodError(res, err)
		return
	}

	res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error")
}

export default errorHandler