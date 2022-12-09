import React from 'react';
import { useDispatch } from 'react-redux';
import ModalImage from 'react-modal-image';
import { toast } from 'react-toastify';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	CloseOutlined,
} from '@ant-design/icons';

import SkeletonImage from 'images/cardImageSkeleton.png';

const ProductCardCheckout = ({ product }) => {
	const dispatch = useDispatch();
	const colors = [
		'Black',
		'White',
		'Brown',
		'Silver',
		'Green',
		'Yellow',
		'Blue',
	];
	const handleOnChangeColor = (e) => {
		let cart = [];
		if (typeof window !== 'undefined') {
			cart = localStorage.getItem('cart');
			if (cart) {
				cart = JSON.parse(localStorage.getItem('cart'));
			}
			cart.map((p, index) => {
				if (p._id === product._id) {
					cart[index].color = e.target.value;
				}
			});
			localStorage.setItem('cart', JSON.stringify(cart));
			dispatch({
				type: 'ADD_TO_CART',
				payload: cart,
			});
		}
	};
	const handleQuantityChange = (e) => {
		let cart = [];
		let count = parseInt(e.target.value) < 1 ? 1 : parseInt(e.target.value);
		if (count > product.quantity) {
			count = product.quantity;
			toast.error(`Max available quantity is ${product.quantity}`);
			return;
		}
		if (typeof window !== 'undefined') {
			cart = localStorage.getItem('cart');
			if (cart) {
				cart = JSON.parse(localStorage.getItem('cart'));
			}
			cart.map((p, index) => {
				if (p._id === product._id) {
					cart[index].count = count;
				}
			});
			localStorage.setItem('cart', JSON.stringify(cart));
			dispatch({
				type: 'ADD_TO_CART',
				payload: cart,
			});
		}
	};
	const handleRemove = () => {
		let cart = localStorage.getItem('cart');
		if (cart) {
			cart = JSON.parse(localStorage.getItem('cart'));
		} else {
			return;
		}
		cart = cart.filter((p) => p._id !== product._id);
		localStorage.setItem('cart', JSON.stringify(cart));
		dispatch({
			type: 'ADD_TO_CART',
			payload: cart,
		});
	};
	return (
		<tbody>
			<tr>
				<td>
					<div style={{ maxWidth: '100px', height: 'auto' }}>
						{product.images.length ? (
							<ModalImage
								small={product.images[0].url}
								large={product.images[0].url}
								alt={product.title}
							/>
						) : (
							<ModalImage
								small={SkeletonImage}
								large={SkeletonImage}
								alt={product.title}
							/>
						)}
					</div>
				</td>
				<td>{product.title}</td>
				<td>${product.price}</td>
				<td>{product.brand}</td>
				<td>
					<select
						onChange={handleOnChangeColor}
						className='form-control'
						name='color'
						value={product.color || 'default'}>
						<option value='default' key='select'>
							Select
						</option>
						{colors.map((color) => {
							return (
								<option value={color} key={color}>
									{color}
								</option>
							);
						})}
					</select>
				</td>
				<td className='text-center'>
					<input
						type='number'
						className='form-control'
						value={product.count}
						onChange={handleQuantityChange}
						max={product.quantity}
					/>
				</td>
				<td>
					{product.shipping === 'yes' ? (
						<CheckCircleOutlined className='text-success' />
					) : (
						<CloseCircleOutlined className='text-danger' />
					)}
				</td>
				<td>
					<CloseOutlined
						onClick={handleRemove}
						className='text-danger pointer'
					/>
				</td>
			</tr>
		</tbody>
	);
};
export default ProductCardCheckout;
