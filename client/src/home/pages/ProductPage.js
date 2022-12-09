import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
	getProductBySlug,
	getRelatedProducts,
} from '../../admin/controllers/product';
import SingleProduct from '../components/cards/SingleProduct';
import { Tabs } from 'antd';
import _ from 'lodash';

import ProductCard from '../../shared/components/products/ProductCard';
import { useAddToCart } from '../../shared/hooks/useAddToCart';

const ProductPage = () => {
	const { cart } = useSelector((state) => ({ ...state }));
	const { slug } = useParams();
	// const { dispatch } = useDispatch();

	const [loading, setLoading] = useState(false);
	// const [title, setTitle] = useState('');
	// const [description, setDescription] = useState('');
	// const [price, setPrice] = useState(0);
	// const [quantity, setQuantity] = useState(0);
	// const [sold, setSold] = useState(0);
	// const [category, setCategory] = useState('');
	// const [sub, setSub] = useState('');
	// const [images, setImages] = useState([]);
	// const [brand, setBrand] = useState('');
	// const [color, setColor] = useState('');

	const [product, setProduct] = useState(null);
	const [relatedProducts, setRelatedProducts] = useState([]);
	// const [tooltip, setTooltip] = useState('Click to add');
	const [tooltip, handleAddToCart] = useAddToCart();

	// const handleAddToCart = (title, description, slug, images, price) => {
	// 	let cart = [];
	// 	if (typeof window !== 'undefined') {
	// 		const item = localStorage.getItem('cart');
	// 		if (item) {
	// 			cart = JSON.parse(item);
	// 		}
	// 		cart.push({ title, description, slug, images, price, count: 1 });
	// 		let unique = _.uniqWith(cart, _.isEqual);
	// 		console.log('unique', unique);
	// 		localStorage.setItem('cart', JSON.stringify(unique));
	// 		setTooltip('Added');
	// 		dispatch({
	// 			type: 'ADD_TO_CART',
	// 			payload: cart,
	// 		});
	// 	}
	// };

	const items = [
		{
			label: 'Description',
			key: 'desc',
			children: product && product.description ? product.description : '',
		}, // remember to pass the key prop
		{
			label: 'More',
			key: 'more',
			children:
				'Call us for number xxxx xxx xx xx to learn more about this product',
		},
	];

	useEffect(() => {
		(async () => {
			setLoading(true);
			await getProductBySlug(slug)
				.then((res) => {
					setLoading(false);
					setProduct(res.data.product);
				})
				.catch((err) => {
					setLoading(false);
					throw new Error(err.message);
				});
		})();
	}, [slug]);
	useEffect(() => {
		if (!product || !product._id) {
			return;
		}
		setLoading(true);
		getRelatedProducts(product._id)
			.then((res) => {
				setLoading(false);
				setRelatedProducts(res.data);
			})
			.catch((err) => {
				setLoading(false);
				throw new Error(err.message);
			});
	}, [product]);

	return (
		<div className='container-fluid'>
			<div className='row pt-4'>
				{product && (
					<SingleProduct
						product={product}
						handleAddToCart={handleAddToCart}
						tooltip={tooltip}
					/>
				)}

				<Tabs type='card' defaultActiveKey='desc' items={items}></Tabs>
			</div>
			<div className='row'>
				<div className='col text-center pt-5 pb-5'>
					<hr />
					<h4>Related Products</h4>
					<hr />
				</div>
			</div>
			<div className='row pb-5'>
				<div className='d-flex justify-content-center'>
					{relatedProducts.length
						? relatedProducts.map((relatedProduct) => {
								return (
									<ProductCard
										title={relatedProduct.title}
										description={relatedProduct.description}
										slug={relatedProduct.slug}
										images={relatedProduct.images}
										key={relatedProduct._id}
										price={relatedProduct.price}
										handleAddToCart={handleAddToCart}
										tooltip={tooltip}
										_id={relatedProduct._id}
										brand={relatedProduct.brand}
										color={relatedProduct.color}
										quantity={relatedProduct.quantity}
										shipping={relatedProduct.shipping}
									/>
								);
						  })
						: 'No related products'}
				</div>
			</div>
		</div>
	);
};
export default ProductPage;
