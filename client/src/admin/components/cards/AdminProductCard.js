import React from 'react';
import { Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import AdminCardImageSkeleton from '../../../images/cardImageSkeleton.png';

const { Meta } = Card;
const AdminProductCard = ({ product, removeProduct }) => {
	const { title, description, images, slug } = product;
	return (
		<Card
			hoverable
			style={{
				width: 240,
				height: 270,
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
				<Link to={`/admin/product/${slug}`}>
					<EditOutlined className='text-warning' />
				</Link>,
				<DeleteOutlined
					className='text-danger'
					onClick={(e) => {
						e.preventDefault();
						removeProduct(slug);
					}}
				/>,
			]}
			className='m-2 mb-4 p-1'>
			<Meta
				title={title}
				description={`${
					description && description.substring(0, 20)
				}...`}
			/>
		</Card>
	);
};
export default AdminProductCard;
