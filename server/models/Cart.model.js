import { Schema, Types, model } from 'mongoose';

const { ObjectId } = Types;

const cartSchema = new Schema(
	{
		products: [
			{
				product: {
					type: ObjectId,
					ref: 'Product',
				},
				count: {
					type: Number,
				},
				color: {
					type: String,
				},
				price: Number,
			},
		],
		cartTotal: Number,
		cartTotalAfterDiscount: Number,
		orderedBy: {
			type: ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true },
);

const CartSchema = model('Cart', cartSchema);
export default CartSchema;
