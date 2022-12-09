import Coupon from '../models/Coupon.model.js';

class CouponController {
	constructor() {
		if (!CouponController.instance) {
			CouponController.instance = this;
		}
		return CouponController.instance;
	}
	async createCoupon(req, res) {
		const { coupon } = req.body;
		const { name, expires, discount } = coupon;
		try {
			const newCoupon = await new Coupon({
				name,
				expires,
				discount,
			}).save();
			res.status(200).json(newCoupon);
		} catch (err) {
			throw new Error(err.message);
		}
	}
	async listCoupons(req, res) {
		try {
			const coupons = await Coupon.find({})
				.sort({ createdAt: -1 })
				.exec();
			res.status(200).json(coupons);
		} catch (err) {
			throw new Error(err.message);
		}
	}
	async deleteCoupon(req, res) {
		const { couponId } = req.params;
		try {
			await Coupon.findByIdAndDelete(couponId).exec();
			res.status(200).send({ ok: true });
		} catch (err) {
			throw new Error(err.message);
		}
	}
}
CouponController.instance = undefined;
const couponController = new CouponController();
Object.freeze(couponController);
export default couponController;
