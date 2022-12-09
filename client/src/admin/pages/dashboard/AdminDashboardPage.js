import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { useGetOrders } from '../../hooks/useGetOrders';
import AdminNav from '../../components/nav/AdminNav';
import Orders from 'admin/components/cards/Orders';

const AdminDashboardPage = () => {
	const [getOrders, changeOrderStatus] = useGetOrders();
	const [orders, setOrders] = useState([]);
	const { user } = useSelector((state) => ({ ...state }));

	const loadOrders = () => {
		getOrders(user.token).then((res) => {
			setOrders(res.data);
		});
	};

	const handleOrderStatusChange = (orderId, orderStatus) => {
		changeOrderStatus(orderId, orderStatus, user.token).then((res) => {
			toast.success('Status updated successfully');
			loadOrders();
		});
	};

	useEffect(() => {
		if (!user) return;
		loadOrders();
	}, [user]);
	return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-md-2'>
					<AdminNav />
				</div>
				<div className='col'>
					<h4>Admin Dashboard</h4>
					<Orders
						orders={orders}
						handleOrderStatusChange={handleOrderStatusChange}
					/>
				</div>
			</div>
		</div>
	);
};
export default AdminDashboardPage;
