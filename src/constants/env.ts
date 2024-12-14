// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import "dotenv/config";

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw Error(`Missing String environment variable for ${key}`);
  }

  return value;
};

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnv("PORT", "5000");
export const MONGO_URI = getEnv("MONGO_URI");
export const APP_ORIGIN = getEnv("APP_ORIGIN");