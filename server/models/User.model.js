import { Schema, model, Types } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const schema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: false, minlength: 6 },
		role: { type: String, required: true, default: 'subscriber' },
		cart: { type: Array, default: [] },
		address: { type: String, required: false },
		wishlist: [
			{
				type: Types.ObjectId,
				required: false,
				ref: 'Product',
			},
		],
	},
	{ timestamps: true },
);
schema.plugin(uniqueValidator);

const UserSchema = model('User', schema);

export default UserSchema;
