import { Schema, model, Types } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const ProductSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			maxLength: 32,
			text: true,
		},
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true,
			index: true,
		},
		description: {
			type: String,
			required: true,
			maxLength: 2000,
			text: true,
		},
		price: {
			type: Number,
			required: true,
			trim: true,
		},
		category: {
			type: Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		sub: {
			type: Types.ObjectId,
			ref: 'SubCategory',
			required: false,
		},
		quantity: {
			type: Number,
			default: 0,
		},
		sold: {
			type: Number,
			default: 0,
		},
		images: {
			type: Array,
		},
		shipping: {
			type: String,
			enum: ['Yes', 'No'],
		},
		color: {
			type: String,
			enum: [
				'Black',
				'White',
				'Brown',
				'Silver',
				'Green',
				'Yellow',
				'Blue',
			],
		},
		brand: {
			type: String,
			enum: ['Apple', 'Sumsung', 'Microsoft', 'Lenovo', 'ASUS'],
		},
		ratings: [
			{
				star: Number,
				postedBy: {
					type: Types.ObjectId,
					ref: 'User',
				},
			},
		],
		postedBy: {
			type: Types.ObjectId,
			ref: 'User',
		},
		avgRating: {
			type: Number,
			default: 0,
			required: false,
		},
	},
	{ timestamps: true },
);
ProductSchema.index({ title: 'text', description: 'text' });
ProductSchema.plugin(uniqueValidator);
const productSchema = model('Product', ProductSchema);
export default productSchema;
