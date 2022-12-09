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
			required: true,
			lowercase: true,
			index: true,
		},
		parent: {
			type: Types.ObjectId,
			ref: 'Category',
			required: true,
		},
	},
	{ timestamps: true },
);
schema.plugin(uniqueValidator);

const SubCategorySchema = model('SubCategory', schema);

export default SubCategorySchema;
