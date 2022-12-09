import React from 'react';
import { Drawer, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import SkeletonImage from 'images/cardImageSkeleton.png';

const SideDrawer = () => {
	const dispatch = useDispatch();

	const imageStyle = {
		width: '100%',
		height: '50px',
		objectFit: 'cover',
	};
	const { drawer, cart } = useSelector((state) => ({ ...state }));
	return (
		<Drawer
			className='text-center'
			title={`Cart / ${cart.length} Product`}
			placement='right'
			open={drawer}
			onClose={() => dispatch({ type: 'SET_VISIBLE', payload: false })}>
			{cart &&
				cart.length > 0 &&
				cart.map((product) => {
					return (
						<div className='row' key={product._id}>
							<div className='col'>
								{product.images[0] ? (
									<>
										<img
											src={product.images[0].url}
											style={imageStyle}
											alt={product.name}
										/>
										<p className='text-center bg-secondary text-light'>
											{product.title} x {product.count}
										</p>
									</>
								) : (
									<>
										<img
											src={SkeletonImage}
											style={imageStyle}
											alt={product.name}
										/>
										<p className='text-center bg-secondary text-light'>
											{product.title} x {product.count}
										</p>
									</>
								)}
							</div>
						</div>
					);
				})}
			<Link to='/cart'>
				<button
					className='btn btn-primary btn-reaised btn-block text-center'
					onClick={() => {
						dispatch({ type: 'SET_VISIBLE', payload: false });
					}}>
					Go To Cart
				</button>
			</Link>
		</Drawer>
	);
};
export default SideDrawer;
