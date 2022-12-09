import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import DatePicker from 'react-date-picker';
import { DeleteOutlined } from '@ant-design/icons';

import { useCoupon } from '../../../shared/hooks/useCoupon';
import AdminNav from '../../components/nav/AdminNav';

const CreateCouponPage = () => {
	const user = useSelector((state) => state.user);
	const [getCoupons, createCoupon, deleteCoupon] = useCoupon();
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState('');
	const [expires, setExpires] = useState('');
	const [discount, setDiscount] = useState(0);
	const [coupons, setCoupons] = useState([]);
	const [couponAdded, setCouponAdded] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('name', name);
		console.log('expires', expires);
		console.log('discount', discount);
		if (name.length < 6) {
			toast.error('Please input a minimum of 6 characters');
			return;
		}
		let coupon = {
			name,
			expires,
			discount,
		};
		setLoading(true);
		await createCoupon(coupon, user.token)
			.then((res) => {
				setLoading(false);
				setCouponAdded(true);
				setName('');
				setExpires('');
				setDiscount(0);
				toast.success('Coupon address successfully');
			})
			.catch((err) => {
				setLoading(false);
				setCouponAdded(false);
				toast.error(err.message);
			});
	};
	const handleDeleteCoupon = async (e, id) => {
		e.preventDefault();
		setLoading(true);
		await deleteCoupon(id, user.token)
			.then((res) => {
				setLoading(false);
				let clonedCoupons = coupons.filter((coup) => coup._id !== id);
				setCoupons(clonedCoupons);
				toast.success('Coupon deleted successfully');
			})
			.catch((err) => {
				setLoading(false);
				throw new Error(err.message);
			});
	};

	useEffect(() => {
		(async () => {
			setLoading(true);
			await getCoupons()
				.then((res) => {
					setLoading(false);
					setCoupons(res.data);
				})
				.catch((err) => {
					setLoading(false);
					throw new Error(err.message);
				});
		})();
	}, [couponAdded]);

	return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-md-2'>
					<AdminNav />
				</div>
				<div className='col-md-10'>
					{loading ? (
						<h4 className='text-danger'>Loading...</h4>
					) : (
						<h4>Create Coupon</h4>
					)}
					<hr />
					<form onSubmit={handleSubmit}>
						<div className='form-group'>
							<label className='text-muted'>Name</label>
							<input
								type='text'
								name='name'
								placeholder='Name'
								value={name}
								onChange={(e) => setName(e.target.value)}
								className='form-control'
							/>
						</div>
						<div className='form-group'>
							<label className='text-muted'>Discount</label>
							<input
								type='number'
								name='discount'
								placeholder='Discount'
								value={discount}
								onChange={(e) => setDiscount(e.target.value)}
								className='form-control'
							/>
						</div>
						<div className='form-group'>
							<label className='text-muted'>Expires</label>
							<DatePicker
								className='form-control'
								selected={new Date()}
								value={expires}
								onChange={(date) => setExpires(date)}
								required
							/>
						</div>
						<button
							type='submit'
							className='btn btn-outline-primary mt-3'
							disabled={!name || !expires || !discount}>
							Save
						</button>
					</form>
					<hr />
					<h4>{coupons.length} Coupons</h4>
					<table className='table table-bordered'>
						<thead className='thead-light'>
							<tr>
								<th scope='col'>Name</th>
								<th scope='col'>Expires</th>
								<th scope='col'>Discount</th>
								<th scope='col'>Action</th>
							</tr>
						</thead>
						<tbody>
							{coupons.length > 0 &&
								coupons.map((coupon) => {
									return (
										<tr key={coupon._id}>
											<td>{coupon.name}</td>
											<td>{coupon.expires}</td>
											<td>{coupon.discount}</td>
											<td>
												<button
													className='text-danger btn'
													onClick={(e) =>
														handleDeleteCoupon(
															e,
															coupon._id,
														)
													}>
													delete
												</button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
export default CreateCouponPage;
