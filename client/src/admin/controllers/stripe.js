import axios from 'axios';

const createPaymentIntent = async (authtoken, coupon) => {
	return axios.post(
		`${process.env.REACT_APP_BASE_API}/create-payment-intent`,
		{ couponApplied: coupon },
		{ headers: { authtoken } },
	);
};

export { createPaymentIntent };
