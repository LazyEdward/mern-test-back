// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import mongoose, { SchemaDefinition, SchemaDefinitionType } from "mongoose";

export type TCreatedTimestampDocument = {
	createdDateTime: number,
	createdAt: Date,
}

export type TTimestampDocument = {
	lastModified: number,
  updatedAt: Date,
} & TCreatedTimestampDocument

export const getNumberCreatedTimestampSchema = <T extends mongoose.Document>(model: SchemaDefinition<SchemaDefinitionType<T>, T>) => (
	new mongoose.Schema<T>(
		{
			createdDateTime: { type: Number },
			...model,
		}, {
			timestamps: {
				currentTime: ()=> Date.now(),
				createdAt: "createdDateTime"
			}
		}
	)
)

export const getNumberTimestampSchema = <T extends mongoose.Document>(model: SchemaDefinition<SchemaDefinitionType<T>, T>) => ( 
	new mongoose.Schema<T>(
		{
			createdDateTime: { type: Number },
			lastModified: { type: Number },
			...model,
		}, {
			timestamps: {
				currentTime: ()=> Date.now(),
				createdAt: "createdDateTime",
				updatedAt: "lastModified"
			}
		}
	)
)

export const updateTimestamp = (schema: TTimestampDocument & mongoose.Document) => {
	if(schema.isModified("updatedAt"))
		schema.lastModified = schema.updatedAt.valueOf()
}
