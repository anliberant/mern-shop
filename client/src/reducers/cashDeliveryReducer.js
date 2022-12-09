export const cashDeliveryReducer = (state = false, action) => {
	switch (action.type) {
		case 'CASH_DELIVERY': {
			return action.payload;
		}
		default: {
			return state;
		}
	}
};
