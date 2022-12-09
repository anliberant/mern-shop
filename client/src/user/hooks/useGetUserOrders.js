import axios from 'axios';

const useGetUserOrders = () => {
	const getUserOrders = (authtoken) => {
		return axios.post(
			`${process.env.REACT_APP_BASE_API}/user/cart/orders`,
			{},
			{
				headers: {
					authtoken,
				},
			},
		);
	};
	return [getUserOrders];
};

export { useGetUserOrders };
