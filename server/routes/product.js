import { Router } from 'express';

import { authCheck, adminCheck } from '../middlewares/auth.middleware.js';
import productController from '../controllers/productController.js';

const router = Router();

router.post(
	'/products',
	authCheck,
	adminCheck,
	productController.createProduct,
);
router.get('/products', productController.getAllProducts);
router.post('/products', productController.listProducts);
router.get('/products/:count', productController.getProducts);
router.post(
	'/products/star/:productId',
	authCheck,
	productController.productRatings,
);
router.get(
	'/products/set-avg-rating/:productId',
	productController.setAvgRating,
);
router.get('/product/:slug', productController.getProduct);
router.get('/product/related/:productId', productController.getProductsRelated);
router.delete(
	'/product/:slug',
	authCheck,
	adminCheck,
	productController.deleteProduct,
);
router.put(
	'/product/:slug',
	authCheck,
	adminCheck,
	productController.updateProduct,
);
router.post('/products-sorted', productController.getSortedProducts);
router.post(
	'/products-paginated',
	productController.getSortedPaginatedProducts,
);
router.get('/products-total', productController.getProductsCount);
router.post('/search/filters', productController.getSearchFilters);

export { router };
