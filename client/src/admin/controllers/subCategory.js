import axios from 'axios';

const getSubCategories = async () => {
	return await axios.get(`${process.env.REACT_APP_BASE_API}/subs`);
};
const getSubCategoriesById = async (id) => {
	return await axios.get(`${process.env.REACT_APP_BASE_API}/subs/${id}`);
};
const getSubCategory = async (slug) => {
	return await axios.get(`${process.env.REACT_APP_BASE_API}/sub/${slug}`);
};
const getSubCategoryBySlugWithProducts = async (slug) => {
	return await axios.get(
		`${process.env.REACT_APP_BASE_API}/sub/products/${slug}`,
	);
};
const removeSubCategory = async (slug, authtoken) => {
	return await axios.delete(`${process.env.REACT_APP_BASE_API}/sub/${slug}`, {
		headers: {
			authtoken,
		},
	});
};
const updateSubCategory = async (catSlug, category, authtoken) => {
	return await axios.put(
		`${process.env.REACT_APP_BASE_API}/sub/${catSlug}`,
		category,
		{
			headers: {
				authtoken,
			},
		},
	);
};
const createSubCategory = async ({ name, parent }, authtoken) => {
	return await axios.post(
		`${process.env.REACT_APP_BASE_API}/sub/`,
		{ name, parent },
		{
			headers: {
				authtoken: authtoken,
			},
		},
	);
};

export {
	getSubCategories,
	getSubCategoriesById,
	getSubCategory,
	removeSubCategory,
	updateSubCategory,
	createSubCategory,
	getSubCategoryBySlugWithProducts,
};
