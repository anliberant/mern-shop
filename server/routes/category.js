import { Router } from 'express';

import categoryController from '../controllers/categoryController.js';
import { authCheck, adminCheck } from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
	'/category',
	authCheck,
	adminCheck,
	categoryController.createCategory,
);
router.get('/categories', categoryController.getCategories);
router.get('/category/:slug', categoryController.getCategory);
router.get(
	'/category/products/:slug',
	categoryController.getCategoryWithProducts,
);
router.put(
	'/category/:slug',
	authCheck,
	adminCheck,
	categoryController.updateCategory,
);
router.delete(
	'/category/:slug',
	authCheck,
	adminCheck,
	categoryController.deleteCategory,
);

export { router };
