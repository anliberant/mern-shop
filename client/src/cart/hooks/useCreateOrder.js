import axios from 'axios';

const useCreateOrder = () => {
	const createOrder = async (stripeResponse, authtoken) => {
		return axios.post(
			`${process.env.REACT_APP_BASE_API}/user/order`,
			{
				stripeResponse,
			},
			{
				headers: {
					authtoken,
				},
			},
		);
	};
	const emptyUserCart = async (authtoken) => {
		return axios.delete(
			`${process.env.REACT_APP_BASE_API}//user/cart/empty`,
			{
				headers: {
					authtoken,
				},
			},
		);
	};
	return [createOrder, emptyUserCart];
};

export { useCreateOrder };
