import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import AdminProductCard from '../../components/cards/AdminProductCard';
import AdminNav from '../../components/nav/AdminNav';
import {
	getProductsByCount,
	removeProductBySlug,
} from '../../controllers/product';
const count = 100;

const AdminProductPage = () => {
	const { user } = useSelector((state) => ({ ...state }));
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	const removeProduct = (slug) => {
		setLoading(true);
		removeProductBySlug(slug, user.token)
			.then(() => {
				let allProducts = products
					? products.filter((p) => p.slug !== slug)
					: [];
				setProducts(allProducts);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				toast.error('Error deleting product' + err.message);
				throw new Error(err.message);
			});
	};

	useEffect(() => {
		setLoading(true);
		getProductsByCount(count)
			.then((res) => {
				setProducts(res.data.products);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				console.log(error);
				toast.error(error.message);
			});
	}, []);

	return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-md-2'>
					<AdminNav />
				</div>
				<div className='col'>
					{loading ? (
						<h4 className='text-danger'>Loading...</h4>
					) : (
						<h4>All Products</h4>
					)}
					<div className='row'>
						{products.length > 0 &&
							products.map((product) => {
								return (
									<AdminProductCard
										product={product}
										key={product._id}
										removeProduct={removeProduct}
									/>
								);
							})}
					</div>
				</div>
			</div>
		</div>
	);
};
export default AdminProductPage;
