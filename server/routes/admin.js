import { Router } from 'express';

import { authCheck, adminCheck } from '../middlewares/auth.middleware.js';
import adminController from '../controllers/adminController.js';

const router = Router();

router.post(
	'/admin/orders',
	authCheck,
	adminCheck,
	adminController.getAllOrders,
);
router.put(
	'/admin/order-status',
	authCheck,
	adminCheck,
	adminController.orderStatus,
);

export { router };
