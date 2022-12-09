import React from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

import ShowPayInfo from 'user/components/ShowPayInfo';

const Orders = ({ orders, handleOrderStatusChange }) => {
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

	return orders.map((order) => {
		return (
			<div className='row pb-5' key={order._id}>
				<div className='btn btn-block bg-light'>
					<ShowPayInfo order={order} showStatus={false} />
					<div className='row'>
						<div className='col-md-4'>Delivery Status</div>
						<div className='col-md-8'>
							<select
								className='form-control'
								defaultValue={order.orderStatus}
								name='status'
								onChange={(e) =>
									handleOrderStatusChange(
										order._id,
										e.target.value,
									)
								}>
								{/* 'not-processed',
                                    'processing',
                                    'dispatched',
                                    'canceled',
                                    'completed', */}
								<option value={'not-processed'}>
									not-processed
								</option>
								<option value={'processing'}>processing</option>
								<option value={'dispatched'}>dispatched</option>
								<option value={'canceled'}>canceled</option>
								<option value={'completed'}>completed</option>
							</select>
						</div>
					</div>
				</div>
				{showOrderInTable(order)}
			</div>
		);
	});
};
export default Orders;
