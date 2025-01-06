// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { rateLimit } from 'express-rate-limit'
import { TOO_MANY_REQUESTS } from '../constants/httpStatus'

// request limiter for auth routes
const authReqLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	limit: 20, // 20 requests / 1 hour
	statusCode: TOO_MANY_REQUESTS,
	message: { 'message': 'Too many auth requests from this IP' }
})

export default authReqLimiter