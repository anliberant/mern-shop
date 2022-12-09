import axios from 'axios';

const useGetOrders = () => {
	const getOrders = async (authtoken) => {
		return await axios.post(
			`${process.env.REACT_APP_BASE_API}/admin/orders`,
			{},
			{ headers: { authtoken } },
		);
	};
	const changeOrderStatus = async (orderId, orderStatus, authtoken) => {
		return await axios.put(
			`${process.env.REACT_APP_BASE_API}/admin/order-status`,
			{
				orderId,
				orderStatus,
			},
			{ headers: { authtoken } },
		);
	};

	return [getOrders, changeOrderStatus];
};

export { useGetOrders };
