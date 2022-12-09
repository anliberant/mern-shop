import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';

import { useSendCartToBackend } from '../hooks/useSendCartToBackend';
import { useToken } from '../hooks/useToken';
import { useCashDelivery } from '../../user/hooks/useCashDelivery';
import { useCreateOrder } from '../hooks/useCreateOrder';

const CheckoutPage = () => {
	const { user, cash } = useSelector((state) => ({ ...state }));
	const navigate = useNavigate();
	const [sendCartToBackend, getUserCart, emptyCartUser, updateUserAddress] =
		useSendCartToBackend();
	const [products, setProducts] = useState([]);
	const [cartTotal, setCartTotal] = useState(0);
	const [cartTotalAfterDiscount, setCartTotalAfterDiscount] = useState(0);
	const [discountError, setDiscountError] = useState('');
	const [address, setAddress] = useState('');
	const [isAddressExist, setIsAddressExist] = useState(false);
	const [coupon, setCoupon] = useState('');
	const dispatch = useDispatch();
	const [applyCoupon] = useToken();
	const [createCashDeliveryOrder] = useCashDelivery();
	const [createOrder, emptyUserCart] = useCreateOrder();

	useEffect(() => {
		if (!user || !user.token) {
			return;
		}
		(async () => {
			await getUserCart(user.token).then((res) => {
				setProducts(res.data.products);
				setCartTotal(res.data.cartTotal);
			});
		})();
	}, [user]);

	const handleEmptyCart = async () => {
		await emptyCartUser(user.token).then(() => {
			setProducts([]);
			setCartTotal(0);
			localStorage.removeItem('cart');
			dispatch({
				type: 'ADD_TO_CART',
				payload: {},
			});
			toast.success('Cart is empty. Continue shopping');
		});
	};

	const saveAddressToDb = async () => {
		await updateUserAddress(address, user.token).then(() => {
			toast.success('Address saved successfully');
			setIsAddressExist(true);
		});
	};
	const showAddress = () => {
		return (
			<>
				<ReactQuill
					theme='snow'
					value={address}
					onChange={setAddress}
				/>
				<button
					className='btn btn-primary mt-2'
					onClick={saveAddressToDb}>
					Save
				</button>
			</>
		);
	};
	const showProductsSummary = () => {
		return (
			<>
				{products.length &&
					products.map((product) => {
						return (
							<div key={product._id}>
								<p>
									{`${product.product.title} ${
										product.color
									} x ${product.count} = ${
										product.product.price * product.count
									}`}
								</p>
							</div>
						);
					})}
			</>
		);
	};
	const handleApplyCoupon = async (e) => {
		e.preventDefault();
		try {
			await applyCoupon(coupon, user.token).then((res) => {
				console.log('coupon response', res);
				if (res.data) {
					setCartTotalAfterDiscount(
						parseFloat(res.data.cartTotalAfterDiscount),
					);
				}
				console.log('cartTotal after discount', cartTotalAfterDiscount);
				toast.success(`Coupon ${coupon} applied successfully`);
				setDiscountError('');
				dispatch({
					type: 'APPLY_COUPON',
					payload: true,
				});
			});
		} catch (err) {
			if (Number(err.response.status) === 404) {
				setDiscountError('Coupon not found');
				toast.error('Coupon not found');
			} else {
				setDiscountError(err.message);
				toast.error(err.message);
			}
			setCartTotalAfterDiscount(0);
			dispatch({
				type: 'APPLY_COUPON',
				payload: false,
			});
		}
		console.log('coupon applied', coupon);
	};
	const showApplyCoupon = () => {
		return (
			<>
				<input
					type='text'
					className='form-control'
					onChange={(e) => setCoupon(e.target.value)}
					value={coupon}
				/>
				<button
					className='btn btn-primary mt-2'
					onClick={handleApplyCoupon}>
					Apply
				</button>
			</>
		);
	};

	const createCashOrder = (e) => {
		e.preventDefault();
		createCashDeliveryOrder(user.token).then((res) => {
			if (res.data.ok) {
				dispatch({
					type: 'ADD_TO_CART',
					payload: [],
				});
				if (typeof window !== 'undefined') {
					localStorage.removeItem('cart');
				}
				dispatch({
					type: 'APPLY_COUPON',
					payload: false,
				});
				dispatch({
					type: 'CASH_DELIVERY',
					payload: false,
				});
				emptyUserCart(user.token);
				setTimeout(() => {
					navigate('/user/history');
				}, 1000);
			}
		});
	};

	return (
		<div className='row'>
			<div className='col-md-6'>
				<h4>Delivery Address</h4>
				<br />
				<br />
				{showAddress()}
				<hr />
				<h4>GOT COUPON ?</h4>
				<br />
				{showApplyCoupon()}
				<br />
				{discountError && (
					<p className='bg-danger p-2'>{discountError}</p>
				)}
			</div>
			<div className='col-md-6'>
				<h4>Order Summary</h4>
				<hr />
				<p>Products {products.length}</p>
				<hr />
				{showProductsSummary()}
				<p>LIST OF PRODUCTS</p>
				<hr />
				<p>Cart total: ${cartTotal}</p>
				{cartTotalAfterDiscount > 0 && (
					<p className='bg-success p-2'>
						Discount Applied: Total Payable $
						{cartTotalAfterDiscount}
					</p>
				)}
				<div className='row'>
					<div className='col-md-6'>
						<button
							className='btn btn-primary'
							disabled={!isAddressExist || !products.length}
							onClick={
								cash
									? (e) => createCashOrder(e)
									: () => navigate('/payment')
							}>
							Place Order
						</button>
					</div>
					<div className='col-md-6'>
						<button
							className='btn btn-primary'
							onClick={handleEmptyCart}
							disabled={!products.length}>
							Empty Cart
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default CheckoutPage;
