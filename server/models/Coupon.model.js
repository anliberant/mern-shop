import { Schema, model } from 'mongoose';

const CouponSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			unique: true,
			uppercase: true,
			required: true,
			minLength: [6, 'Too short'],
			maxLength: [12, 'Too long'],
		},
		expires: {
			type: Date,
			required: true,
		},
		discount: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true },
);

const couponSchema = model('Coupon', CouponSchema);
export default couponSchema;
