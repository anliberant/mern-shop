import { Router } from 'express';

import authController from '../controllers/authController.js';
import { authCheck, adminCheck } from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
	'/create-or-update-user',
	authCheck,
	authController.createOrUpdateUser,
);
router.post('/current-user', authCheck, authController.getCurrentUser);
router.post(
	'/current-admin',
	authCheck,
	adminCheck,
	authController.getCurrentUser,
);

export { router };
