import slugify from 'slugify';

import SubCategory from '../models/SubCategory.model.js';
import Product from '../models/Product.model.js';

class SubCategoryController {
	constructor() {
		if (!SubCategoryController.instance) {
			SubCategoryController.instance = this;
		}
		return SubCategoryController.instance;
	}
	async getSubCategories(req, res, next) {
		const subCategories = await SubCategory.find().sort({ createdAt: 1 });
		if (!subCategories) {
			return res.json({ err: 'SubCategories not found' });
		}
		res.json(subCategories);
	}
	async getSubCategoriesByCategorySlug(req, res, next) {
		const { slug } = req.params;
		const subCategories = await SubCategory.find({ parent: slug })
			.sort({ createdAt: 1 })
			.exec();
		if (!subCategories) {
			return res.json({ err: 'SubCategories not found' });
		}
		res.json(subCategories);
	}
	async getSubCategoryWithProducts(req, res, next) {
		const { slug } = req.params;
		const subCategory = await SubCategory.findOne({ slug }).exec();
		if (!subCategory) {
			return res.json({ err: 'SubCategories not found' });
		}
		const products = await Product.find({ sub: subCategory })
			.sort({ createdAt: 1 })
			.exec();
		res.json({ subCategory, products });
	}
	async createSubCategory(req, res, next) {
		try {
			const { name, parent } = req.body;
			const subCategory = new SubCategory({
				name,
				slug: slugify(name).toLowerCase(),
				parent,
			});
			await subCategory.save();
			res.json(subCategory);
		} catch (err) {
			res.status(400).send('Create subcategory failed: ' + err.message);
		}
	}
	async getSubCategory(req, res, next) {
		const { slug } = req.params;
		const candidateSubCategory = await SubCategory.findOne({
			slug: slug,
		}).exec();
		if (!candidateSubCategory) {
			return res.json({ err: 'SubCategory not found' });
		}
		res.json(candidateSubCategory);
	}
	async updateSubCategory(req, res, next) {
		const { slug } = req.params;
		const { name, categorySlug, parent } = req.body;
		console.log('slug', slug);
		console.log('Updating subcategory', name, categorySlug, parent);
		if (!name && !categorySlug && !parent) {
			return res.status(400).json({ err: 'Data is empty' });
		}
		const candidateSubCategory = await SubCategory.findOneAndUpdate(
			{
				slug,
			},
			{ name, slug: categorySlug, parent },
			{ new: true },
		);
		if (!candidateSubCategory) {
			res.status(400).json({ err: 'Category not found' });
		} else {
			res.json(candidateSubCategory);
		}
	}
	async deleteSubCategory(req, res, next) {
		const { slug } = req.params;
		try {
			const candidateSubCategory = await SubCategory.findOneAndDelete({
				slug,
			});
			if (!candidateSubCategory) {
				res.json({ err: 'SubCategory not found' });
			}
			res.json({ message: 'SubCategory removed successfully' });
		} catch (err) {
			res.json({ err: 'Something went wrong' });
		}
	}
}
SubCategoryController.instance = undefined;
const subCategoryController = new SubCategoryController();
Object.freeze(subCategoryController);
export default subCategoryController;
