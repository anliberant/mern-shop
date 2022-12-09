import axios from 'axios';

const useCashDelivery = () => {
	const createCashDeliveryOrder = async (authtoken) => {
		return await axios.post(
			`${process.env.REACT_APP_BASE_API}/user/cash-order`,
			{},
			{ headers: { authtoken } },
		);
	};

	return [createCashDeliveryOrder];
};

export { useCashDelivery };
