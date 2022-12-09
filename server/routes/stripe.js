import { Router } from 'express';
import stripeController from '../controllers/stripeController.js';
import { authCheck } from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
	'/create-payment-intent',
	authCheck,
	stripeController.createPaymentIntent,
);

export { router };
