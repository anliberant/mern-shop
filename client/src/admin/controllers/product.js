import axios from 'axios';

const createProduct = async (product, authtoken) => {
	return await axios.post(
		`${process.env.REACT_APP_BASE_API}/products`,
		product,
		{
			headers: {
				authtoken,
			},
		},
	);
};
const getProducts = async () => {
	return await axios.get(`${process.env.REACT_APP_BASE_API}/products`);
};
const getSortedProducts = async (sort, order, limit) => {
	return await axios.post(
		`${process.env.REACT_APP_BASE_API}/products-sorted`,
		{
			sort,
			order,
			limit,
		},
	);
};
const getSortedPaginatedProducts = async (sort, order, page) => {
	return await axios.post(
		`${process.env.REACT_APP_BASE_API}/products-paginated`,
		{
			sort,
			order,
			page,
		},
	);
};
const getProductsByCount = async (count) => {
	return await axios.get(
		`${process.env.REACT_APP_BASE_API}/products/${count}`,
	);
};

const getProductBySlug = async (slug) => {
	return await axios.get(`${process.env.REACT_APP_BASE_API}/product/${slug}`);
};

const removeProductBySlug = async (slug, authtoken) => {
	return await axios.delete(
		`${process.env.REACT_APP_BASE_API}/product/${slug}`,
		{
			headers: {
				authtoken,
			},
		},
	);
};

const updateProductBySlug = async (slug, authtoken, product) => {
	return await axios.put(
		`${process.env.REACT_APP_BASE_API}/product/${slug}`,
		{ product },
		{
			headers: {
				authtoken,
			},
		},
	);
};
const getAllProductsCount = async () => {
	return await axios.get(`${process.env.REACT_APP_BASE_API}/products-total/`);
};
const setRatingToProduct = async (productId, star, authtoken) => {
	return await axios.post(
		`${process.env.REACT_APP_BASE_API}/products/star/${productId}`,
		{ star },
		{
			headers: {
				authtoken,
			},
		},
	);
};
const setAvgRatingToProduct = async (productId) => {
	return await axios.get(
		`${process.env.REACT_APP_BASE_API}/products/set-avg-rating/${productId}`,
	);
};

const getRelatedProducts = async (productId) => {
	return await axios.get(
		`${process.env.REACT_APP_BASE_API}/product/related/${productId}`,
	);
};

const getFilteredProducts = async (filters) => {
	const { text, price, category, stars, sub, brand, color, shipping } =
		filters;
	return await axios.post(
		`${process.env.REACT_APP_BASE_API}/search/filters`,
		{ query: text, price, category, stars, sub, brand, color, shipping },
	);
};

export {
	createProduct,
	getProducts,
	getProductsByCount,
	removeProductBySlug,
	getProductBySlug,
	updateProductBySlug,
	getSortedProducts,
	getAllProductsCount,
	getSortedPaginatedProducts,
	setRatingToProduct,
	getRelatedProducts,
	getFilteredProducts,
	setAvgRatingToProduct,
};
