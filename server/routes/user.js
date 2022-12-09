import { Router } from 'express';

import { authCheck } from '../middlewares/auth.middleware.js';
import userController from '../controllers/userController.js';

const router = Router();

router.post('/user/cart', authCheck, userController.saveUserCart);
router.post('/user/get/cart', authCheck, userController.getCart);
router.delete('/user/cart/empty', authCheck, userController.clearCart);
router.post('/user/cart/address', authCheck, userController.updateCartAdress);
router.post('/user/cart/coupon', authCheck, userController.applyCoupon);
router.post('/user/cart/orders', authCheck, userController.getOrders);
router.post('/user/order', authCheck, userController.createOrder);
router.post('/user/wishlist', authCheck, userController.addToWishlist);
router.put('/user/wishlist', authCheck, userController.updateUserWishlist);
router.post('/user/wishlist/get', authCheck, userController.getUserWishlist);
router.post('/user/cash-order', authCheck, userController.createCashOrder);

export { router };
