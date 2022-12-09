import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { getSortedProducts } from '../../admin/controllers/product';
import Jumbotron from '../../shared/components/Jumbotron';
import LoadingCard from '../../shared/components/products/LoadingCard';
import NewArrivals from '../components/NewArrivals';
import BestSellers from '../components/BestSellers';
import CategoryList from '../../shared/components/categories/CategoryList';
import SubCategoriesList from '../../shared/components/subs/SubCategoriesList';
import { useAddToCart } from '../../shared/hooks/useAddToCart';

const HomePage = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [tooltip, handleAddToCart] = useAddToCart();

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
			await getSortedProducts('createdAt', 'desc', 20)
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
	}, []);

	return (
		<>
			<div className='jumbotron text-danger h1 font-weight-bold text-center pt-5 pb-5 display-4'>
				<Jumbotron
					strings={[
						'Latest Products',
						'New Arrivals',
						'Best Sellers',
					]}
				/>
			</div>
			<h4 className='text-center p-3 mt-5 mb-5 display-6 jumbotron'>
				New Arrivals
			</h4>

			<div className='container'>
				{loading ? (
					<LoadingCard />
				) : (
					<NewArrivals
						calcInitRatings={calcInitRatings}
						tooltip={tooltip}
						handleAddToCart={handleAddToCart}
					/>
				)}
			</div>
			<h4 className='text-center p-3 mt-5 mb-5 display-6 jumbotron'>
				Best Sellers
			</h4>
			<div className='container'>
				{loading ? (
					<LoadingCard />
				) : (
					<BestSellers
						calcInitRatings={calcInitRatings}
						tooltip={tooltip}
						handleAddToCart={handleAddToCart}
					/>
				)}
			</div>
			<h4 className='text-center p-3 mt-5 mb-5 display-6 jumbotron'>
				Categories
			</h4>
			<div className='container mb-5'>
				{loading ? <LoadingCard /> : <CategoryList />}
			</div>
			<h4 className='text-center p-3 mt-5 mb-5 display-6 jumbotron'>
				Sub Categories
			</h4>
			<div className='container mb-5'>
				{loading ? <LoadingCard /> : <SubCategoriesList />}
			</div>
		</>
	);
};
export default HomePage;
