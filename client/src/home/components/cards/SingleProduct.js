import React, { useState, useEffect } from 'react';
import { Card, Tooltip } from 'antd';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import {
	setRatingToProduct,
	setAvgRatingToProduct,
} from '../../../admin/controllers/product';
import CardImageSkeleton from '../../../images/cardImageSkeleton.png';
import ProductListItems from '../ProductListItems';
import { useSelector } from 'react-redux';
import RatingModal from '../modals/RatingModal';
import { useGetUserWishlist } from '../../../user/hooks/useGetUserWishlist';
import { toast } from 'react-toastify';

const SingleProduct = ({ product, handleAddToCart, tooltip }) => {
	const {
		description,
		title,
		price,
		images,
		slug,
		quantity,
		category,
		sub,
		color,
		brand,
		sold,
		_id,
		shipping,
		ratings,
	} = product;
	const [getUserWishlist, addToWishlist, deleteFromWishlist] =
		useGetUserWishlist();
	const { user } = useSelector((state) => ({ ...state }));
	const [rating, setRating] = useState(0);
	const [personalRating, setPersonalRating] = useState(0);
	const [isWishlisted, setIsWishlisted] = useState(false);
	const navigate = useNavigate();

	const handleRating = (rate) => {
		setRating(rate);
		setRatingToProduct(_id, rate, user && user.token).then(() => {
			setAvgRatingToProduct(_id);
		});
	};

	const handleAddToWishlist = (e) => {
		e.preventDefault();
		if (isWishlisted) {
			deleteFromWishlist(_id, user.token).then((res) => {
				if (res.data.ok) {
					setIsWishlisted(false);
				}
			});
		} else {
			addToWishlist(_id, user.token).then((res) => {
				if (res.data.ok) {
					setIsWishlisted(true);
					toast.success(`${title} has been added to wishlist`);
					navigate('/user/wishlist');
				}
			});
		}
	};

	useEffect(() => {
		let numOfRating = 0;
		let total = 0;
		ratings.length > 0 &&
			ratings.forEach((rating) => {
				if (
					user &&
					user._id &&
					rating.postedBy.toString() === user._id.toString()
				) {
					setPersonalRating(rating.star);
				}
				numOfRating++;
				total += parseInt(rating.star);
			});
		setRating(total / numOfRating);
	}, []);
	useEffect(() => {
		if (!user) return;
		getUserWishlist(user.token).then((res) => {
			res.data.wishlist.forEach((product) => {
				if (product._id === _id) {
					setIsWishlisted(true);
				}
			});
		});
	}, [user]);
	return (
		<>
			<div className='col-md-7'>
				<Carousel
					showArrows={true}
					autoPlay={true}
					infiniteLoop={true}
					showThumbs={images && images.length}>
					{images && images.length > 0 ? (
						images.map((image) => {
							return (
								<img
									src={image.url}
									alt={title}
									key={image.public_id}
								/>
							);
						})
					) : (
						<img
							src={CardImageSkeleton}
							alt='No screenshot available'
						/>
					)}
				</Carousel>
			</div>
			<div className='col-md-5'>
				<h1 className='bg-info p-3'>{title}</h1>
				<div className='text-center pb-2'>
					{rating ? (
						<Rating
							// onClick={handleRating}
							// onPointerEnter={onPointerEnter}
							// onPointerLeave={onPointerLeave}
							// onPointerMove={onPointerMove}
							// transition={true}
							// fillColorArray={[
							// 	'#f14f45',
							// 	'#f16c45',
							// 	'#f18845',
							// 	'#f1b345',
							// 	'#f1d045',
							// ]}
							readonly={true}
							initialValue={rating}
							/* Available Props */
						/>
					) : (
						'No rating yet'
					)}
				</div>
				<Card
					actions={[
						<span
							onClick={() =>
								handleAddToCart(
									title,
									description,
									slug,
									images,
									price,
									_id,
									brand,
									color,
									quantity,
									shipping,
								)
							}>
							<ShoppingCartOutlined className='text-success' />
							<br />
							<Tooltip placement='top' title={tooltip}>
								Add To Cart
							</Tooltip>
						</span>,
						<a onClick={handleAddToWishlist}>
							<HeartOutlined className='text-info' />
							<br />
							{!isWishlisted
								? 'Add to Wishlist'
								: 'Remove from Wishlist'}
						</a>,
						<>
							<RatingModal>
								<Rating
									onClick={handleRating}
									transition={true}
									fillColorArray={[
										'#f14f45',
										'#f16c45',
										'#f18845',
										'#f1b345',
										'#f1d045',
									]}
									initialValue={personalRating}
								/>
							</RatingModal>
						</>,
					]}>
					<ProductListItems
						description={description}
						price={price}
						quantity={quantity}
						category={category}
						sub={sub}
						slug={slug}
						color={color}
						brand={brand}
						sold={sold}
					/>
				</Card>
			</div>
		</>
	);
};
export default SingleProduct;
