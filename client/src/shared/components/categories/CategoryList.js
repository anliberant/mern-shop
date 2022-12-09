import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getCategories } from '../../../admin/controllers/category';

const CategoryList = () => {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async () => {
			setLoading(true);
			await getCategories()
				.then((res) => {
					setCategories(res.data);
					setLoading(false);
				})
				.catch((err) => {
					setLoading(false);
					throw new Error(err.message);
				});
		})();
	}, []);

	const showCategories = () => {
		return (
			categories.length &&
			categories.map((category) => {
				return (
					<div
						className='col btn btn-outlined-primary btn-large btn-block btn-raised m-3'
						key={category._id}>
						<Link to={`/category/${category.slug}`}>
							{category.name}
						</Link>
					</div>
				);
			})
		);
	};
	return (
		<div className='row'>
			{loading ? <h3>Loading...</h3> : showCategories()}
		</div>
	);
};
export default CategoryList;
