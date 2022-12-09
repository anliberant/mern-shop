import React, { useState, useEffect } from 'react';
import { getProductsByCount } from '../../admin/controllers/product';
import ProductCard from '../../shared/components/products/ProductCard';
import LoadingCard from '../../shared/components/products/LoadingCard';
import FilterMenu from '../components/FilterMenu';
import { useAddToCart } from '../../shared/hooks/useAddToCart';

const ShopHomePage = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [tooltip, handleAddToCart] = useAddToCart();

	// LOAD DEFAULT PRODUCTS

	useEffect(() => {
		(async () => {
			setLoading(true);
			await getProductsByCount(10)
				.then((res) => {
					setProducts(res.data.products);
					setLoading(false);
				})
				.catch((err) => {
					setLoading(false);
					throw new Error(err.message);
				});
		})();
	}, []);

	const showProducts = () => {
		return (
			<div className='d-flex justify-content-start flex-wrap'>
				{products &&
					products.length > 0 &&
					products.map((product) => {
						return (
							<ProductCard
								title={product.title}
								description={product.description}
								slug={product.slug}
								images={product.images}
								price={product.price}
								key={product._id}
								handleAddToCart={handleAddToCart}
								tooltip={tooltip}
								_id={product._id}
								brand={product.brand}
								color={product.color}
								quantity={product.quantity}
								shipping={product.shipping}
							/>
						);
					})}
			</div>
		);
	};

	return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-md-3 pt-2'>
					<h4>Search/Filter</h4>
					<FilterMenu setProducts={setProducts} />
				</div>
				<div className='col-md-9'>
					{loading ? (
						<h4>Loading...</h4>
					) : (
						<h4 className='text-danger'>Products</h4>
					)}
					{loading ? <LoadingCard /> : showProducts()}
				</div>
			</div>
		</div>
	);
};
export default ShopHomePage;
