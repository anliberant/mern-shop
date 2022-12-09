import Stripe from 'stripe';

import User from '../models/User.model.js';
import Cart from '../models/Cart.model.js';
import Coupon from '../models/Coupon.model.js';
import Product from '../models/Product.model.js';

const key = process.env.STRIPE_SECRET_KEY || '';

const stripe = new Stripe(key, {});

class StripeController {
	constructor() {
		if (!StripeController.instance) {
			StripeController.instance = this;
		}
		return StripeController.instance;
	}
	async createPaymentIntent(req, res) {
		const user = await User.findOne({ email: req.user.email }).exec();
		if (!user) {
			return res.status(400).json({ error: 'User not found' });
		}
		// 2 get user cart total
		const cart = await Cart.findOne({
			orderedBy: user._id,
		}).exec();
		if (!cart) {
			return res.status(400).json({ error: 'Cart not found' });
		}
		const { cartTotal, cartTotalAfterDiscount } = cart;

		if (!cartTotal) {
			return res.status(400).json({ error: 'Cart fetch error' });
		}
		console.log('CART_TOTAL_AFTER_DISCOUNT', cartTotalAfterDiscount);

		console.log('CART TOTAL CHARGED', cartTotal);
		// create payment intent with order amount and currency

		let finalAmount = 0;
		if (cartTotalAfterDiscount) {
			finalAmount = cartTotalAfterDiscount * 100;
		} else {
			finalAmount = cartTotal * 100;
		}
		console.log('finalAmount: ', finalAmount);
		const paymentIntent = await stripe.paymentIntents.create({
			amount: finalAmount,
			currency: 'usd',
		});

		res.send({
			clientSecret: paymentIntent.client_secret,
			cartTotal,
			cartTotalAfterDiscount,
			payable: finalAmount,
		});
	}
}
StripeController.instance = undefined;
const stripeController = new StripeController();
Object.freeze(stripeController);
export default stripeController;
