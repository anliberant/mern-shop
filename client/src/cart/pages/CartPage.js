import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import ProductCardCheckout from '../components/cards/ProductCardCheckout';
import { useSendCartToBackend } from '../hooks/useSendCartToBackend';

const CartPage = () => {
	const { user, cart } = useSelector((state) => ({ ...state }));
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [sendCartToBackend] = useSendCartToBackend();

	const getTotal = () => {
		return cart.reduce((currentValue, nextValue) => {
			return currentValue + nextValue.count * nextValue.price;
		}, 0);
	};
	const showCartItems = () => {
		return (
			<div className='table-responsive'>
				<table className='table table-bordered table-striped table-sm '>
					<thead className='thead-light'>
						<tr>
							<th scope='col'>Image</th>
							<th scope='col'>Title</th>
							<th scope='col'>Price</th>
							<th scope='col'>Brand</th>
							<th scope='col'>Color</th>
							<th scope='col'>Count</th>
							<th scope='col'>Shipping</th>
							<th scope='col'>Remove</th>
						</tr>
					</thead>
					{cart.map((product) => {
						return (
							<ProductCardCheckout
								product={product}
								key={product._id}
							/>
						);
					})}
				</table>
			</div>
		);
	};
	const saveOrderToDb = async () => {
		await sendCartToBackend(cart, user.token)
			.then((res) => {
				if (res.data.ok) {
					navigate('/checkout');
				}
			})
			.catch((err) => {
				console.error(err);
				throw new Error(err.message);
			});
	};
	const saveCashOrderToDb = async () => {
		dispatch({
			type: 'CASH_DELIVERY',
			payload: true,
		});
		saveOrderToDb();
	};

	return (
		<div className='container-fluid pt-2'>
			<div className='row'>
				<div className='col-md-8'>
					<h4>Cart / {cart.length} Product</h4>
					{!cart.length ? (
						<p>
							No products in card.{' '}
							<Link to={'/shop'}>Continue shopping</Link>
						</p>
					) : (
						showCartItems()
					)}
				</div>
				<div className='col-md-4'>
					<h4>Order Summary</h4>
					<hr />
					<p>Products</p>
					{cart.map((product) => {
						return (
							<div key={product.title}>
								{product.title} * {product.count} = $
								{product.price * product.count}
							</div>
						);
					})}
					<hr />
					<p>
						Total: <b>${getTotal()}</b>
					</p>
					{user ? (
						<>
							<button
								className='btn btn-sm btn-primary mt-2'
								onClick={saveOrderToDb}
								type='button'
								disabled={!cart.length}>
								Proceed to Checkout
							</button>
							<br />
							<button
								className='btn btn-sm btn-warning mt-2'
								onClick={saveCashOrderToDb}
								type='button'
								disabled={!cart.length}>
								Pay Cash on Delivery
							</button>
						</>
					) : (
						<button className='btn btn-sm btn-primary mt-2'>
							<Link to={'/login'}>Login to checkout</Link>
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
export default CartPage;
