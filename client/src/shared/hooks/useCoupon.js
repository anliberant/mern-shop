import axios from 'axios';

const useCoupon = () => {
	const getCoupons = async () => {
		return await axios.get(`${process.env.REACT_APP_BASE_API}/coupons`);
	};
	const createCoupon = async (coupon, authtoken) => {
		return await axios.post(
			`${process.env.REACT_APP_BASE_API}/coupon`,
			{ coupon },
			{
				headers: {
					authtoken,
				},
			},
		);
	};
	const deleteCoupon = async (couponId, authtoken) => {
		return await axios.delete(
			`${process.env.REACT_APP_BASE_API}/coupons/${couponId}`,
			{
				headers: {
					authtoken,
				},
			},
		);
	};

	return [getCoupons, createCoupon, deleteCoupon];
};

export { useCoupon };
