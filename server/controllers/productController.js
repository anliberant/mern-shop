import slugify from 'slugify';
import Product from '../models/Product.model.js';
import User from '../models/User.model.js';

class ProductController {
	constructor() {
		if (!ProductController.instance) {
			ProductController.instance = this;
		}
		return ProductController.instance;
	}
	async createProduct(req, res, next) {
		try {
			const {
				title,
				description,
				price,
				brand,
				quantity,
				category,
				subCategory,
				images,
				color,
				postedBy,
				shipping,
			} = req.body;
			const sub = subCategory ? subCategory : null;

			const newProduct = new Product({
				title,
				slug: slugify(title).toLowerCase(),
				description,
				price,
				brand,
				category,
				sub,
				quantity,
				images,
				color,
				postedBy,
				shipping,
			});
			await newProduct.save();
			res.json(newProduct);
		} catch (err) {
			res.status(400).send('Create product failed: ' + err.message);
		}
	}

	async getProducts(req, res, next) {
		const { count } = req.params;
		try {
			const products = await Product.find()
				.limit(parseInt(count))
				.populate('category')
				.populate('sub')
				.sort([['createdAt', 'desc']])
				.exec();
			if (!products) {
				return res.status(404).send('Products not found');
			}
			res.status(200).send({
				products,
			});
		} catch (err) {
			return res.status(400).json({
				err: err.message,
			});
		}
	}
	async getAllProducts(req, res, next) {
		const products = await Product.find()
			.populate('category')
			.populate('sub')
			.sort([['createdAt', 'desc']])
			.exec();
		if (!products.length) {
			return res.status(404).json('Products not found');
		}
		res.status(200).json(products);
	}
	async getSortedProducts(req, res, next) {
		const { sort, order, limit } = req.body;
		const products = await Product.find({})
			.populate('category')
			.populate('sub')
			.sort([[sort, order]])
			.limit(limit)
			.exec();
		res.status(200).json(products);
	}
	async getSortedPaginatedProducts(req, res, next) {
		const { sort, order, page } = req.body;
		const currentPage = page || 1;
		const perPage = 3;
		const products = await Product.find({})
			.skip((currentPage - 1) * perPage)
			.populate('category')
			.populate('sub')
			.sort([[sort, order]])
			.limit(perPage)
			.exec();
		res.status(200).json(products);
	}
	async getProductsCount(req, res, next) {
		const total = await Product.find({}).estimatedDocumentCount().exec();
		res.status(200).json(total);
	}

	async deleteProduct(req, res, next) {
		const { slug } = req.params;
		try {
			await Product.findOneAndRemove({ slug });
		} catch (err) {
			console.error(err);
			throw new Error(err.message);
		}
		res.status(200).json({ message: 'Product removed successfully' });
	}
	async getProduct(req, res, next) {
		const { slug } = req.params;
		let product;
		try {
			product = await Product.findOne({ slug: slug })
				.populate('category')
				.populate('sub')
				.exec();
		} catch (err) {
			console.error(err);
			throw new Error(err.message);
		}
		if (!product) {
			return res.status(404).json({ err: 'Product not found' });
		}
		res.status(200).json({ product });
	}
	async updateProduct(req, res, next) {
		const { slug } = req.params;
		const { product } = req.body;
		let newProduct;
		try {
			newProduct = await Product.findOneAndUpdate(
				{ slug },
				{ ...product },
				{ new: true },
			);
		} catch (err) {
			return res
				.status(401)
				.send({ err: 'Product not updated properly' });
		}
		res.status(200).json({ newProduct });
	}
	async listProducts(req, res, next) {
		const { sort, order, limit } = req.body;
		try {
			const products = await Product.find({})
				.populate('category')
				.populate('sub')
				.sort([[sort, order]])
				.limit(limit)
				.exec();
			res.status(200).json(products);
		} catch (err) {
			return res.status(401).json({ err: 'Product not sorted properly' });
		}
	}
	async productRatings(req, res, next) {
		const { productId } = req.params;
		const { star } = req.body;
		const email = req.user.email;
		if (!email) {
			return res.status(401).json({ error: 'You must be logged in' });
		}
		const candidateUser = await User.findOne({ email }).exec();
		if (!candidateUser) {
			return res
				.status(401)
				.json({ error: 'Email address not assigned to any user' });
		}

		const candidateProduct = await Product.findById(productId).exec();
		if (!candidateProduct) {
			return res.status(404).json({ error: 'Product not found' });
		}

		const candidateRating = candidateProduct.ratings.find((rating) => {
			return rating.postedBy.toString() === candidateUser._id.toString();
		});
		if (!candidateRating) {
			const ratingAdded = await candidateProduct
				.updateOne(
					{
						$push: {
							ratings: { star, postedBy: candidateUser._id },
						},
					},
					{ new: true },
				)
				.exec();
			console.log('ratingAdded', ratingAdded);
			res.status(200).json(ratingAdded);
		} else {
			const ratingUpdated = await Product.findById(productId)
				.updateOne(
					{
						ratings: { $elemMatch: candidateRating },
					},
					{ $set: { 'ratings.$.star': star, new: true } },
				)
				.exec();
			console.log('ratings updated', ratingUpdated);
			res.status(200).json(ratingUpdated);
		}
	}
	async getProductsRelated(req, res, next) {
		const { productId } = req.params;

		const product = await Product.findById(productId).exec();
		if (!product) {
			return res.status(404).json({ error: 'Product not found' });
		}
		const related = await Product.find({
			_id: { $ne: productId },
			category: product.category,
		})
			.limit(3)
			.populate('category')
			.populate('sub')
			.exec();

		res.status(200).json(related);
	}

	// SEARCH FILTERS
	async getSearchFilters(req, res, next) {
		const { query, price, category, stars, sub, shipping, color, brand } =
			req.body;
		let products;

		if (query) {
			if (query.length < 5) {
				try {
					products = await Product.find({
						slug: {
							$regex: `(.*)${query}(.*)`,
						},
					})
						.populate('category', '_id name')
						.populate('sub', '_id name')
						.exec();
				} catch (err) {
					throw new Error(err.message);
				}
			} else {
				try {
					products = await Product.find({
						$text: { $search: query },
					})
						.populate('category', '_id, name')
						.populate('sub', '_id, name')
						.populate('postedBy', '_id, name')
						.exec();
				} catch (err) {
					throw new Error(err.message);
				}
			}
		} else {
			try {
				products = await Product.find()
					.limit(12)
					.populate('category')
					.populate('sub')
					.sort([['createdAt', 'desc']])
					.exec();
			} catch (err) {
				throw new Error(err.message);
			}
		}
		if (price && price.length > 0) {
			try {
				products = await Product.find({
					price: {
						$gte: price[0],
						$lte: price[1],
					},
				})
					.populate('category')
					.populate('sub')
					.sort([['createdAt', 'desc']])
					.exec();
			} catch (err) {
				throw new Error(err.message);
			}
		}
		if (category) {
			try {
				products = await Product.find({
					category,
				})
					.populate('category')
					.populate('sub')
					.populate('createdBy', '_id, name')
					.sort([['createdAt', 'desc']])
					.exec();
			} catch (err) {
				throw new Error(err.message);
			}
		}
		if (stars) {
			try {
				products = await Product.find({ avgRating: stars }).exec();
			} catch (err) {
				throw new Error(err.message);
			}
		}
		if (sub) {
			try {
				products = await Product.find({ sub }).exec();
			} catch (err) {
				throw new Error(err.message);
			}
		}
		if (shipping) {
			try {
				products = await Product.find({ shipping }).exec();
			} catch (err) {
				throw new Error(err.message);
			}
		}
		if (color) {
			try {
				products = await Product.find({ color }).exec();
			} catch (err) {
				throw new Error(err.message);
			}
		}
		if (brand) {
			try {
				products = await Product.find({ brand }).exec();
			} catch (err) {
				throw new Error(err.message);
			}
		}

		return res.status(200).json(products);
	}

	// SET AVERAGE RATING
	async setAvgRating(req, res, next) {
		const { productId } = req.params;
		const candidateProduct = await Product.findById(productId).exec();
		if (!candidateProduct) {
			return res.status(404).json({ error: 'Product not found' });
		}
		let avgRating = 0;
		candidateProduct.ratings &&
			candidateProduct.ratings.forEach((rating) => {
				if (rating.star) {
					avgRating += rating.star;
				}
			});
		candidateProduct.avgRating = avgRating;
		await candidateProduct.save().then((result) => {
			res.status(200).json(result);
		});
	}
}
ProductController.instance = undefined;
const productController = new ProductController();
Object.freeze(productController);

export default productController;
