import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import { DollarOutlined, CheckOutlined } from '@ant-design/icons';

import { createPaymentIntent } from '../../admin/controllers/stripe';
import SkeletonImage from '../../images/cardImageSkeleton.png';
import { useCreateOrder } from '../../cart/hooks/useCreateOrder';

const cartStyle = {
	style: {
		base: {
			color: '#32325d',
			fontFamily: 'Arial, sans-serif',
			fontSmoothing: 'antialiased',
			fontSize: '16px',
			'::placeholder': {
				color: '#32325d',
			},
		},
		invalid: {
			color: '#fa755a',
			iconColor: '#fa755a',
		},
	},
};

const StripeCheckout = () => {
	const dispatch = useDispatch();
	const { user, coupon } = useSelector((state) => ({ ...state }));

	const [succeeded, setSucceeded] = useState(false);
	const [error, setError] = useState(null);
	const [processing, setProcessing] = useState('');
	const [disabled, setDisabled] = useState(true);
	const [clientSecret, setClientSecret] = useState('');
	const [cartTotal, setCartTotal] = useState(0);
	const [cartTotalAfterDiscount, setCartTotalAfterDiscount] = useState(0);
	const [payable, setPayable] = useState(0);
	const [createOrder, emptyUserCart] = useCreateOrder();

	const stripe = useStripe();
	const elements = useElements();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setProcessing(true);

		const payload = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: elements.getElement(CardElement),
				billing_details: e.target.name.value,
			},
		});
		if (payload.error) {
			setError(`Payment failed: ${payload.error.message}`);
		} else {
			createOrder(payload.paymentIntent, user.token).then((res) => {
				if (res.data.ok) {
					if (typeof window !== 'undefined') {
						localStorage.removeItem('cart');
					}
					dispatch({
						type: 'ADD_TO_CART',
						payload: [],
					});
					dispatch({
						type: 'APPLY_COUPON',
						payload: false,
					});
					emptyUserCart(user.token);
				}
			});
			setError(null);
			setProcessing(false);
			setSucceeded(true);
		}
	};
	const handleChange = async (e) => {
		setDisabled(e.empty);
		setError(e.error ? e.error.message : '');
	};
	useEffect(() => {
		if (!user) {
			return;
		}
		createPaymentIntent(user.token, coupon).then((response) => {
			setClientSecret(response.data.clientSecret);
			setCartTotal(response.data.cartTotal);
			setCartTotalAfterDiscount(response.data.cartTotalAfterDiscount);
			setPayable(response.data.payable);
		});
	}, [user]);

	return (
		<>
			{!succeeded && (
				<div>
					{coupon && cartTotalAfterDiscount !== undefined ? (
						<p className='alert alert-success'>
							{`Total after discount: $${cartTotalAfterDiscount}`}
						</p>
					) : (
						<p className='alert alert-danger'>No Coupon Applied</p>
					)}
				</div>
			)}
			<div className='text-center pb-5'>
				<Card
					cover={
						<img
							src={SkeletonImage}
							alt=''
							style={{
								height: '200px',
								objectFit: 'cover',
								marginBottom: '-50px',
							}}
						/>
					}
					actions={[
						<>
							<DollarOutlined className='text-info' />
							<br />
							Total: ${cartTotal}
						</>,
						<>
							<CheckOutlined className='text-info' />
							<br />
							Total payable: ${(payable / 100).toFixed(2)}
						</>,
					]}
				/>
			</div>
			<form
				id='payment-form'
				className='stripe-form'
				onSubmit={handleSubmit}>
				<CardElement
					id='card-element'
					options={cartStyle}
					onChange={handleChange}
				/>
				<button
					className='stripe-button'
					disabled={processing || disabled || succeeded}>
					<span id='button-text'>
						{processing ? (
							<div className='spinner' id='spinner'></div>
						) : (
							'Pay'
						)}
					</span>
				</button>
				<br />
				{error && (
					<div className='card-error' role='alert'>
						{error}
					</div>
				)}
			</form>
			<p
				className={
					succeeded ? 'result-message' : 'result-message hidden'
				}>
				Payment Successfull.{' '}
				<Link to='/user/history'>See it in your purchase history</Link>
			</p>
		</>
	);
};
export default StripeCheckout;
