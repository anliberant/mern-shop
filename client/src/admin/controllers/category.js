import axios from 'axios';

const getCategories = async () => {
	return await axios.get(`${process.env.REACT_APP_BASE_API}/categories`);
};
const getCategory = async (slug) => {
	return await axios.get(
		`${process.env.REACT_APP_BASE_API}/category/${slug}`,
	);
};
const getCategoryWithProducts = async (slug) => {
	return await axios.get(
		`${process.env.REACT_APP_BASE_API}/category/products/${slug}`,
	);
};
const removeCategory = async (slug, authtoken) => {
	return await axios.delete(
		`${process.env.REACT_APP_BASE_API}/category/${slug}`,
		{
			headers: {
				authtoken,
			},
		},
	);
};
const updateCategory = async (catSlug, category, authtoken) => {
	return await axios.put(
		`${process.env.REACT_APP_BASE_API}/category/${catSlug}`,
		category,
		{
			headers: {
				authtoken,
			},
		},
	);
};
const createCategory = async (category, authtoken) => {
	return await axios.post(
		`${process.env.REACT_APP_BASE_API}/category/`,
		category,
		{
			headers: {
				authtoken: authtoken,
			},
		},
	);
};

export {
	getCategories,
	getCategory,
	getCategoryWithProducts,
	removeCategory,
	updateCategory,
	createCategory,
};
