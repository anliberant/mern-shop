import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { getSubCategoryBySlugWithProducts } from '../../admin/controllers/subCategory';
import LoadingCard from '../components/products/LoadingCard';
import ProductCard from '../components/products/ProductCard';

const SubCategoryPage = () => {
	const { slug } = useParams();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	const calcInitRatings = (ratings) => {
		let numOfRating = 0;
		let total = 0;
		ratings.length > 0 &&
			ratings.forEach((rating) => {
				numOfRating++;
				total += parseInt(rating.star);
			});
		return total / numOfRating;
	};

	useEffect(() => {
		(async () => {
			setLoading(true);
			await getSubCategoryBySlugWithProducts(slug)
				.then((res) => {
					setProducts(res.data.products);
					setLoading(false);
				})
				.catch((err) => {
					setLoading(false);
					throw new Error(err.message);
				});
		})();
	}, [slug]);
	return (
		<div className='container'>
			{loading ? (
				<h2 className='m-3'>Loading...</h2>
			) : (
				<h2 className='m-3'>
					{products && products.length > 0 ? (
						<span>
							Products in{' '}
							{slug &&
								slug.charAt(0).toUpperCase() + slug.slice(1)}
						</span>
					) : (
						<span>No products yet</span>
					)}
				</h2>
			)}
			{loading ? (
				<LoadingCard />
			) : (
				<div className='row'>
					<div className='d-flex flex-wrap justify-content-center'>
						{products &&
							products.length > 0 &&
							products.map((product) => {
								return (
									<div className='' key={product._id}>
										<div className='d-flex justify-content-center'>
											<Rating
												readonly={true}
												size={18}
												initialValue={calcInitRatings(
													product.ratings,
												)}
												/* Available Props */
											/>
										</div>
										<ProductCard
											title={product.title}
											description={product.description}
											slug={product.slug}
											images={product.images}
											key={product._id}
										/>
									</div>
								);
							})}
					</div>
				</div>
			)}
		</div>
	);
};
export default SubCategoryPage;
