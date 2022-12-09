import axios from 'axios';

export function useSendCartToBackend() {
	const sendCartToBackend = async (cart, authtoken) => {
		return await axios.post(
			`${process.env.REACT_APP_BASE_API}/user/cart`,
			{ cart },
			{
				headers: { authtoken },
			},
		);
	};
	const getUserCart = async (authtoken) => {
		return await axios.post(
			`${process.env.REACT_APP_BASE_API}/user/get/cart`,
			{},
			{
				headers: {
					authtoken,
				},
			},
		);
	};
	const emptyCartUser = async (authtoken) => {
		return await axios.delete(
			`${process.env.REACT_APP_BASE_API}/user/cart/empty`,
			{
				headers: {
					authtoken,
				},
			},
		);
	};

	const updateUserAddress = async (address, authtoken) => {
		return await axios.post(
			`${process.env.REACT_APP_BASE_API}/user/cart/address`,
			{ address },
			{
				headers: {
					authtoken,
				},
			},
		);
	};

	return [sendCartToBackend, getUserCart, emptyCartUser, updateUserAddress];
}
