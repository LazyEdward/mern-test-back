// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Request, Response, NextFunction } from "express";

const defaultHandler = (controller: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await controller(req, res, next);
		}
		catch (err) {
			next(err)
		}
	}

export default defaultHandler