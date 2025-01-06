// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import "dotenv/config";

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined)
    throw Error(`Missing String environment variable for ${key}`);

  return value;
};

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnv("PORT", "5000");
export const MONGO_URI = getEnv("MONGO_URI");
export const APP_ORIGIN = getEnv("APP_ORIGIN");

export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REfRESH_SECRET = getEnv("JWT_REFRESH_SECRET");

export const EMAIL_HOST = getEnv("EMAIL_HOST");
export const EMAIL_PORT = getEnv("EMAIL_PORT");
export const EMAIL_AUTH_USER = getEnv("EMAIL_AUTH_USER");
export const EMAIL_AUTH_PASS = getEnv("EMAIL_AUTH_PASS");
export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
export const EMAIL_SENDER_NAME = getEnv("EMAIL_SENDER_NAME");