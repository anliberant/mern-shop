import _ from 'lodash';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export function useAddToCart() {
	const dispatch = useDispatch();
	const [tooltip, setTooltip] = useState('Click to add');

	const handleAddToCart = (
		title,
		description,
		slug,
		images,
		price,
		_id,
		brand,
		color,
		quantity,
		shipping,
	) => {
		let cart = [];
		if (typeof window !== 'undefined') {
			const item = localStorage.getItem('cart');
			if (item) {
				cart = JSON.parse(item);
			}
			cart.push({
				title,
				description,
				slug,
				images,
				price,
				count: 1,
				_id,
				brand,
				color,
				quantity,
				shipping,
			});
			let unique = _.uniqWith(cart, _.isEqual);
			console.log('unique', unique);
			localStorage.setItem('cart', JSON.stringify(unique));
			setTooltip('Added');
			dispatch({
				type: 'ADD_TO_CART',
				payload: unique,
			});
			dispatch({
				type: 'SET_VISIBLE',
				payload: true,
			});
		}
	};
	return [tooltip, handleAddToCart];
}
