import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Pagination } from 'antd';

import {
	getAllProductsCount,
	getSortedPaginatedProducts,
} from '../../admin/controllers/product';
import ProductCard from '../../shared/components/products/ProductCard';
import LoadingCard from '../../shared/components/products/LoadingCard';
import { Rating } from 'react-simple-star-rating';

const NewArrivals = ({ calcInitRatings, tooltip, handleAddToCart }) => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [productsCount, setProductsCount] = useState(0);

	useEffect(() => {
		(async () => {
			setLoading(true);
			await getSortedPaginatedProducts('createdAt', 'desc', page)
				.then((result) => {
					setLoading(false);
					setProducts(result.data);
				})
				.catch((err) => {
					setLoading(false);
					toast.error('Error fetching products' + err.message);
					throw new Error(err.message);
				});
		})();
	}, [page]);

	useEffect(() => {
		(async () => {
			await getAllProductsCount()
				.then((res) => {
					setProductsCount(res.data);
				})
				.catch((err) => {
					setLoading(false);
					toast.error('Error fetching products count' + err.message);
					throw new Error(err.message);
				});
		})();
	}, []);

	return (
		<>
			<div className='container d-flex justify-content-center'>
				{loading ? (
					<LoadingCard />
				) : (
					<div className='row'>
						<div className='d-flex flex-wrap justify-content-center'>
							{products &&
								products.length &&
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
												description={
													product.description
												}
												slug={product.slug}
												images={product.images}
												price={product.price}
												_id={product._id}
												brand={product.brand}
												color={product.color}
												quantity={product.quantity}
												shipping={product.shipping}
												key={product._id}
												handleAddToCart={
													handleAddToCart
												}
												tooltip={tooltip}
											/>
										</div>
									);
								})}
						</div>
					</div>
				)}
			</div>
			<div className='row'>
				<div className='col-md-4 offset-md-4 text-center pt-5 p-3'>
					<Pagination
						defaultCurrent={page}
						total={Math.round((productsCount / 3) * 10)}
						onChange={(value) => setPage(value)}
					/>
				</div>
			</div>
		</>
	);
};
export default NewArrivals;
