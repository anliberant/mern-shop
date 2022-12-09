import axios from 'axios';

const useToken = () => {
	const applyCoupon = async (coupon, authtoken) => {
		return axios.post(
			`${process.env.REACT_APP_BASE_API}/user/cart/coupon`,
			{
				coupon,
			},
			{
				headers: {
					authtoken,
				},
			},
		);
	};

	return [applyCoupon];
};

export { useToken };
