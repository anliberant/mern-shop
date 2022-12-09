import { Router } from 'express';

import subCategoryController from '../controllers/subCategoryController.js';
import { authCheck, adminCheck } from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
	'/sub',
	authCheck,
	adminCheck,
	subCategoryController.createSubCategory,
);
router.get('/subs', subCategoryController.getSubCategories);
router.get('/subs/:slug', subCategoryController.getSubCategoriesByCategorySlug);

router.get('/sub/:slug', subCategoryController.getSubCategory);
router.get(
	'/sub/products/:slug',
	subCategoryController.getSubCategoryWithProducts,
);
router.put(
	'/sub/:slug',
	authCheck,
	adminCheck,
	subCategoryController.updateSubCategory,
);
router.delete(
	'/sub/:slug',
	authCheck,
	adminCheck,
	subCategoryController.deleteSubCategory,
);

export { router };
