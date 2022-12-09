import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

import UserNav from '../../shared/components/nav/UserNav';
import { useGetUserWishlist } from '../hooks/useGetUserWishlist';

const WhishListPage = () => {
	const [getUserWishlist, addToWishlist, deleteFromWishlist] =
		useGetUserWishlist();
	const [wishlist, setWishlist] = useState([]);
	const user = useSelector((state) => state.user);

	const handleRemove = (productId) => {
		deleteFromWishlist(productId, user.token).then(() => {
			toast.success('Product removed from your wishlist');
			loadWishlist();
		});
	};

	const loadWishlist = () => {
		getUserWishlist(user.token).then((wishlist) => {
			setWishlist(wishlist.data.wishlist);
		});
	};

	useEffect(() => {
		if (!user) {
			return;
		}
		loadWishlist();
	}, [user]);

	return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-md-2'>
					<UserNav />
				</div>
				<div className='col'>
					<h4>Wishlist</h4>
					{wishlist &&
						wishlist.map((product) => {
							return (
								<div
									key={product._id}
									style={{
										display: 'flex',
										justifyContent: 'space-between',
									}}
									className='alert alert-secondary'>
									<Link to={`/product/${product.slug}`}>
										{product.title}
									</Link>
									<div
										className='btn btn-sm float-right'
										onClick={(e) =>
											handleRemove(product._id)
										}>
										<DeleteOutlined className='text-danger' />
									</div>
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
};
export default WhishListPage;
