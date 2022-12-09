import axios from 'axios';

const useGetUserWishlist = () => {
	const getUserWishlist = async (authtoken) => {
		return await axios.post(
			`${process.env.REACT_APP_BASE_API}/user/wishlist/get`,
			{},
			{ headers: { authtoken } },
		);
	};
	const addToWishlist = async (productId, authtoken) => {
		return await axios.post(
			`${process.env.REACT_APP_BASE_API}/user/wishlist`,
			{ productId },
			{ headers: { authtoken } },
		);
	};
	const deleteFromWishlist = async (productId, authtoken) => {
		return await axios.put(
			`${process.env.REACT_APP_BASE_API}/user/wishlist`,
			{ productId },
			{ headers: { authtoken } },
		);
	};

	return [getUserWishlist, addToWishlist, deleteFromWishlist];
};

export { useGetUserWishlist };
