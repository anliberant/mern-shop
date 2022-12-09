import { Router } from 'express';

import couponController from '../controllers/couponController.js';
import { adminCheck, authCheck } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/coupon', authCheck, adminCheck, couponController.createCoupon);
router.get('/coupons', couponController.listCoupons);
router.delete(
	'/coupons/:couponId',
	authCheck,
	adminCheck,
	couponController.deleteCoupon,
);

export { router };
