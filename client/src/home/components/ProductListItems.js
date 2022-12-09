import React from 'react';
import { Link } from 'react-router-dom';

const ProductListItems = ({
	description,
	price,
	quantity,
	category,
	sub,
	slug,
	color,
	brand,
	sold,
}) => {
	return (
		<ul className='list-group'>
			<li className='list-group-item'>
				Price
				<span className='label label-default label-pill float-end'>
					{price}
				</span>
			</li>
			<li className='list-group-item'>
				Category
				<Link to={`/category/${category.slug}`}>
					<span className='label label-default label-pill float-end'>
						{category.name}
					</span>
				</Link>
			</li>
			{sub && (
				<li className='list-group-item'>
					Subcategory
					<Link to={`/sub/${sub.slug}`}>
						<span className='label label-default label-pill float-end'>
							{sub.name}
						</span>
					</Link>
				</li>
			)}
			<li className='list-group-item'>
				Available
				<span className='label label-default label-pill float-end'>
					{quantity}
				</span>
			</li>
			<li className='list-group-item'>
				Color
				<span className='label label-default label-pill float-end'>
					{color}
				</span>
			</li>
			<li className='list-group-item'>
				Brand
				<span className='label label-default label-pill float-end'>
					{brand}
				</span>
			</li>
			<li className='list-group-item'>
				Sold
				<span className='label label-default label-pill float-end'>
					{sold}
				</span>
			</li>
		</ul>
	);
};
export default ProductListItems;
