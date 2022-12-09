import uniqid from 'uniqid';

import Cart from './../models/Cart.model.js';
import User from './../models/User.model.js';
import Product from './../models/Product.model.js';
import Coupon from './../models/Coupon.model.js';
import Order from './../models/Order.model.js';

class UserController {
	constructor() {
		if (!UserController.instance) {
			UserController.instance = this;
		}
		return UserController.instance;
	}
	async saveUserCart(req, res, next) {
		const { cart } = req.body;
		const { email } = req.user;
		let products = [];
		const user = await User.findOne({ email }).exec();
		if (!user) {
			return res.status(400).json({ err: 'User not found' });
		}
		const candidateCart = await Cart.findOne({
			orderedBy: user._id,
		}).exec();

		if (candidateCart) {
			await candidateCart.remove();
			console.log('removed old cart');
		}
		let cartTotal = 0;
		for (let i = 0; i < cart.length; i++) {
			let product = {};
			product.product = cart[i]._id;
			product.color = cart[i].color;
			product.count = cart[i].count;
			cartTotal += cart[i].price * cart[i].count;
			let { price } = await Product.findById(cart[i]._id)
				.select('price')
				.exec();
			product.price = price;
			products.push(product);
		}

		await new Cart({
			products,
			cartTotal,
			orderedBy: user._id,
		}).save();
		res.status(200).send({ ok: true });
	}
	async getCart(req, res, next) {
		const { email } = req.user;
		if (!email) {
			return res.status(404).send({ error: 'User not logged in' });
		}
		try {
			const user = await User.findOne({ email });
			if (!user) {
				return res.status(404).send({ error: 'Wrong email address' });
			}
			const cart = await Cart.findOne({ orderedBy: user._id })
				//.populate('products.product')
				.populate({
					path: 'products',
					// Get friends of friends - populate the 'friends' array for every friend
					populate: {
						path: 'product',
						select: '_id title price',
					},
				})
				.exec();
			if (!cart) {
				return res.status(404).send({ error: 'No cart found' });
			}
			console.log('cart', cart);
			const { products, cartTotal, cartTotalAfterDiscount } = cart;
			res.status(200).json({
				products,
				cartTotal,
				cartTotalAfterDiscount,
			});
		} catch (err) {
			throw new Error(err.message);
		}
	}
	async clearCart(req, res, next) {
		const { email } = req.user;
		try {
			const user = await User.findOne({ email }).exec();
			if (!user) {
				return res.status(404).json({ err: 'User not found' });
			}
			await Cart.findOneAndRemove({ orderedBy: user._id }).exec();
		} catch (err) {
			return res.status(400).json({ err: err.message });
		}
		res.status(200).send({ ok: true });
	}
	async updateCartAdress(req, res, next) {
		const { email } = req.user;
		const { address } = req.body;
		try {
			const user = await User.findOneAndUpdate(
				{ email },
				{ address },
			).exec();
			if (!user) {
				return res.status(404).json({ err: 'User not found' });
			}
			res.status(200).send({ ok: true });
		} catch (err) {
			return res.status(400).json({ err: err.message });
		}
	}
	async applyCoupon(req, res, next) {
		const { coupon } = req.body;
		const { email } = req.user;

		const candidateCoupon = await Coupon.findOne({ name: coupon }).exec();
		if (candidateCoupon === null) {
			return res.status(404).json({ err: 'Coupon not found' });
		}
		const user = await User.findOne({ email }).exec();
		if (!user) {
			return res.status(400).json({ err: 'User not found' });
		}

		// @ts-ignore
		let { products, cartTotal } = await (
			await Cart.findOne({
				orderedBy: user._id,
			})
		).populate('products.product', '_id title price');

		if (!cartTotal || cartTotal <= 0) {
			return res.status(400).json({ err: 'Cart is empty' });
		}
		let cartTotalAfterDiscount = (
			cartTotal -
			(cartTotal * candidateCoupon.discount) / 100
		).toFixed(2);

		await Cart.findOneAndUpdate(
			{ orderedBy: user._id },
			{ cartTotalAfterDiscount },
			{ new: true },
		).exec();

		res.status(200).json({ cartTotalAfterDiscount });
	}
	async createOrder(req, res, next) {
		const paymentIntent = req.body.stripeResponse;
		const { email } = req.user;
		const user = await User.findOne({ email }).exec();

		let { products } = await Cart.findOne({ orderedBy: user._id }).exec();

		let newOrder = await new Order({
			products,
			paymentIntent,
			orderedBy: user._id,
		}).save();

		let bulkOptions = products.map((item) => {
			return {
				updateOne: {
					filter: { _id: item.product._id },
					update: {
						$inc: { quantity: -item.count, sold: +item.count },
					},
				},
			};
		});
		let updated = await Product.bulkWrite(bulkOptions, {});
		console.log('PRODUCT QUANTITY DICREMENTED', updated);
		res.status(200).json({ ok: true });
	}
	async getOrders(req, res, next) {
		const { email } = req.user;

		const user = await User.findOne({ email }).exec();
		const userOrders = await Order.find({
			orderedBy: user._id,
		}).populate('products.product');

		res.status(200).json(userOrders);
	}
	async addToWishlist(req, res, next) {
		const { productId } = req.body;
		const email = req.user.email;

		const user = await User.findOneAndUpdate(
			{ email },
			{
				$addToSet: {
					wishlist: productId,
				},
			},
			{ new: true },
		).exec();

		res.status(200).json({ ok: true });
	}
	async getUserWishlist(req, res, next) {
		const email = req.user.email;
		const wishlist = await User.findOne({ email })
			.select('wishlist')
			.populate('wishlist')
			.exec();

		res.status(200).json(wishlist);
	}
	async updateUserWishlist(req, res, next) {
		const { productId } = req.body;
		const email = req.user.email;

		const user = await User.findOneAndUpdate(
			{ email },
			{
				$pull: {
					wishlist: productId,
				},
			},
		).exec();

		res.status(200).json({ ok: true });
	}
	async createCashOrder(req, res, next) {
		const { email } = req.user;
		const user = await User.findOne({ email }).exec();

		if (!user) {
			return res.status(404).json({ err: 'User not found' });
		}

		let userCart = await Cart.findOne({ orderedBy: user._id }).exec();
		if (!userCart) {
			return res.status(400).json({ error: 'UserCart not found' });
		}

		const { cartTotal, cartTotalAfterDiscount } = userCart;

		if (!cartTotal) {
			return res.status(400).json({ error: 'Cart fetch error' });
		}
		console.log('CART_TOTAL_AFTER_DISCOUNT', cartTotalAfterDiscount);

		console.log('CART TOTAL CHARGED', cartTotal);

		let newOrder = await new Order({
			products: userCart.products,
			paymentIntent: {
				_id: uniqid(),
				amount: cartTotalAfterDiscount
					? cartTotalAfterDiscount
					: cartTotal,
				currency: 'usd',
				status: 'cash-delivery',
				created: new Date(),
				payment_method_types: ['cash'],
			},
			orderedBy: user._id,
		}).save();

		let bulkOptions = userCart.products.map((item) => {
			return {
				updateOne: {
					filter: { _id: item.product._id },
					update: {
						$inc: { quantity: -item.count, sold: +item.count },
					},
				},
			};
		});
		let updated = await Product.bulkWrite(bulkOptions, {});

		res.status(200).json({ ok: true });
	}
}
UserController.instance = undefined;
const userController = new UserController();
Object.freeze(userController);
export default userController;
