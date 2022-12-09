import { Schema, model, Types } from 'mongoose';

const { ObjectId } = Types;

const OrderSchema = new Schema(
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
			},
		],
		paymentIntent: {},
		orderStatus: {
			type: String,
			default: 'not-processed',
			enum: [
				'not-processed',
				'processing',
				'cash-delivery',
				'dispatched',
				'canceled',
				'completed',
			],
		},
		orderedBy: {
			type: ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true },
);

const orderSchema = model('Order', OrderSchema);
export default orderSchema;
