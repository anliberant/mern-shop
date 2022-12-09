import { Router } from 'express';

import cloudinaryController from '../controllers/cloudinaryController.js';
import { authCheck, adminCheck } from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
	'/upload-img',
	authCheck,
	adminCheck,
	cloudinaryController.uploadImg,
);
router.post(
	'/remove-img',
	authCheck,
	adminCheck,
	cloudinaryController.removeImg,
);

export { router };
