import slugify from 'slugify';
import Product from '../models/Product.model.js';

import Category from '../models/Category.model.js';

class CategoryController {
	constructor() {
		if (!CategoryController.instance) {
			CategoryController.instance = this;
		}
		return CategoryController.instance;
	}
	async getCategories(req, res, next) {
		const categories = await Category.find().sort({ createdAt: 1 });
		if (!categories) {
			res.json({ err: 'Categories not found' });
		}
		res.json(categories);
	}
	async createCategory(req, res, next) {
		try {
			const { name } = req.body;
			const category = new Category({
				name,
				slug: slugify(name).toLowerCase(),
			});
			await category.save();
			res.json(category);
		} catch (err) {
			res.status(400).send('Create category failed: ' + err.message);
		}
	}
	async getCategory(req, res, next) {
		const { slug } = req.params;
		const candidateCategory = await Category.findOne({ slug: slug });
		if (!candidateCategory) {
			return res.json({ err: 'Category not found' });
		}
		res.json(candidateCategory);
	}
	async getCategoryWithProducts(req, res, next) {
		const { slug } = req.params;
		const candidateCategory = await Category.findOne({ slug: slug }).exec();
		if (!candidateCategory) {
			return res.json({ err: 'Category not found' });
		}
		const products = await Product.find({
			category: candidateCategory,
		}).exec();

		res.status(200).json({ category: candidateCategory, products });
	}
	async updateCategory(req, res, next) {
		const { slug } = req.params;
		const { name, categorySlug } = req.body;
		const candidateCategory = await Category.findOneAndUpdate(
			{
				slug,
			},
			{ name, slug: categorySlug },
			{ new: true },
		);
		if (!candidateCategory) {
			res.status(400).json({ err: 'Category not found' });
		} else {
			res.json(candidateCategory);
		}
	}
	async deleteCategory(req, res, next) {
		const { slug } = req.params;
		try {
			const candidateCategory = await Category.findOneAndDelete({ slug });
			if (!candidateCategory) {
				res.json({ err: 'Category not found' });
			}
			res.json({ message: 'Category removed successfully' });
		} catch (err) {
			res.json({ err: 'Something went wrong' });
		}
	}
}
CategoryController.instance = undefined;
const categoryController = new CategoryController();
Object.freeze(categoryController);
export default categoryController;
