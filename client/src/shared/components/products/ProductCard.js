import React from 'react';
import { Card, Tooltip } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import AdminCardImageSkeleton from '../../../images/cardImageSkeleton.png';

const { Meta } = Card;

const ProductCard = ({
	title,
	description,
	slug,
	images,
	price,
	handleAddToCart,
	tooltip,
	_id,
	brand,
	color,
	quantity,
	shipping,
}) => {
	let newTitle = `${title} - $${price}`;
	if (newTitle.length > 22) {
		newTitle = newTitle.substring(0, 22);
	}

	return (
		<Card
			hoverable
			style={{
				minWidth: 240,
				height: 300,
				objectFit: 'cover',
			}}
			cover={
				<img
					alt={title}
					src={
						images && images.length
							? images[0].url
							: AdminCardImageSkeleton
					}
					style={{ maxHeight: 120 }}
				/>
			}
			actions={[
				<Link to={`/product/${slug}`}>
					<EyeOutlined className='text-warning' /> <br /> View Product
				</Link>,
				<span>
					<ShoppingCartOutlined className='text-danger' /> <br />
					<Tooltip placement='top' title={tooltip}>
						<a
							href='#!'
							disabled={quantity < 1}
							onClick={(e) => {
								quantity > 0 &&
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
									);
							}}>
							{quantity < 1 ? 'Out of Stock' : 'Add To Cart'}
						</a>
					</Tooltip>
				</span>,
			]}
			className='m-2 mb-4 p-1'>
			<Meta
				title={newTitle}
				description={`${
					description && description.substring(0, 20)
				}...`}
			/>
		</Card>
	);
};
export default ProductCard;
