import React, { useState, useEffect } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import UserNav from '../../shared/components/nav/UserNav';
import { useGetUserOrders } from '../hooks/useGetUserOrders';
import ShowPayInfo from '../components/ShowPayInfo';

const UserHistoryPage = () => {
	const { user } = useSelector((state) => ({ ...state }));
	const [orders, setOrders] = useState([]);
	const [getUserOrders] = useGetUserOrders();

	const loadUserOrders = () => {
		getUserOrders(user.token).then((res) => {
			setOrders(res.data);
		});
	};
	const showOrderInTable = (order) => {
		return (
			<table className='table table-bordered'>
				<thead className='thead-light'>
					<tr>
						<th scope='col'>Title</th>
						<th scope='col'>Price</th>
						<th scope='col'>Brand</th>
						<th scope='col'>Color</th>
						<th scope='col'>Count</th>
						<th scope='col'>Shipping</th>
					</tr>
				</thead>
				<tbody>
					{order.products.map((p) => {
						return (
							<tr key={p.product._id}>
								<td>{p.product.title}</td>
								<td>{p.product.price}</td>
								<td>{p.product.brand}</td>
								<td>{p.color}</td>
								<td>{p.count}</td>
								<td>
									{p.product.shipping === 'yes' ? (
										<CheckCircleOutlined
											style={{ color: 'green' }}
										/>
									) : (
										<CloseCircleOutlined
											style={{ color: 'red' }}
										/>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		);
	};
	const showEachOrders = () => {
		return (
			orders.length > 0 &&
			orders.map((order) => {
				return (
					<div key={order._id} className='m-5 p-3 cart'>
						<ShowPayInfo order={order} />
						{showOrderInTable(order)}
						<div className='row'>
							<div className='col'>
								<p>PDF Download</p>
							</div>
						</div>
					</div>
				);
			})
		);
	};
	useEffect(() => {
		loadUserOrders();
	}, []);
	return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-md-2'>
					<UserNav />
				</div>
				<div className='col text-center'>
					<h4>
						{orders.length > 0
							? 'User purchase orders'
							: 'No purchase orders'}
					</h4>
					{showEachOrders()}
				</div>
			</div>
		</div>
	);
};
export default UserHistoryPage;
