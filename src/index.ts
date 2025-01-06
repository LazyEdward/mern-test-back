// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { APP_ORIGIN, PORT } from "./constants/env";
import { OK } from "./constants/httpStatus";

import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db";


import errorHandler from "./middleware/errorHandler";
import authenticationHandler from "./middleware/authenticate";
import authRoute from "./routes/auth";
import protectedRoute from "./routes/protectedRoute";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
	origin: APP_ORIGIN,
	credentials: true
}))

app.use(cookieParser());

// checking
app.get("/", (_, res) => {
	res.status(OK).json({
		status: "healthy",
	});
	return
});

// routes
app.use('/auth', authRoute)

// protected routes
app.use('/protected', authenticationHandler, protectedRoute)

// error handling
app.use(errorHandler)

app.listen(PORT, async () => {
	console.log(`Server listening on port ${PORT}`);
	await connectToDatabase()
});