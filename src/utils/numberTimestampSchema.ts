// Copyright (c) 2024 LazyEdward
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import mongoose, { SchemaDefinition, SchemaDefinitionType } from "mongoose";

export type TtimestampDocument = {
	createdDateTime: number,
	lastModified: number,
	createdAt: Date,
  updatedAt: Date,
}

const getNumberTimestampSchema = <T extends mongoose.Document>(model: SchemaDefinition<SchemaDefinitionType<T>, T>) => ( 
	new mongoose.Schema<T>(
		{
			createdDateTime: { type: Number, default: Date.now() },
			lastModified: { type: Number, default: Date.now() },
			...model,
		}, {
			timestamps: true
		}
	)
)

export const setTimestamp = (schema: TtimestampDocument & mongoose.Document) => {
	if(schema.isModified("createdAt"))
		schema.createdDateTime = schema.createdAt.valueOf()

	if(schema.isModified("updatedAt"))
		schema.lastModified = schema.updatedAt.valueOf()
}

export default getNumberTimestampSchema