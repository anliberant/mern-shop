let initialState = [];
if (typeof window !== 'undefined') {
	let cart = localStorage.getItem('cart');
	if (cart) {
		initialState = JSON.parse(cart);
	}
}

export const cartReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_TO_CART': {
			return action.payload;
		}
		default: {
			return state;
		}
	}
};
