import { Schema, model, Types } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const schema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
			minLength: [3, 'Too short'],
			maxLength: [32, 'Too long'],
		},
		slug: {
			type: String,
			unique: true,
			required: true,
			lowercase: true,
			index: true,
		},
	},
	{ timestamps: true },
);
schema.plugin(uniqueValidator);

const CategorySchema = model('Category', schema);

export default CategorySchema;
