import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getCategories } from '../../controllers/category';

const UpdateSubCategoryForm = ({
	handleSubmit,
	setName,
	name,
	parent,
	setParent,
	setCategorySlug,
	categorySlug,
}) => {
	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState([]);
	const loadCategories = () => {
		setLoading(true);
		getCategories()
			.then((categories) => {
				setCategories(categories.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				toast.error(err.message);
				throw new Error(err.message);
			});
	};

	useEffect(() => {
		loadCategories();
	}, []);

	return (
		<>
			{loading ? (
				<h3>Loading</h3>
			) : (
				<form onSubmit={handleSubmit}>
					<label>Name</label>
					<input
						type='text'
						name='category'
						className='form-control'
						onChange={(e) => setName(e.target.value)}
						value={name}
						autoFocus
						required
					/>
					<label>Slug</label>
					<input
						type='text'
						name='slug'
						className='form-control'
						onChange={(e) => setCategorySlug(e.target.value)}
						value={categorySlug}
						autoFocus
						required
					/>
					<label>Parent Category</label>
					<select
						name='category'
						className='form-control'
						value={parent}
						onChange={(e) => setParent(e.target.value)}>
						<option>PLEASE SELECT</option>
						{categories.length &&
							categories.map((cat) => {
								return (
									<option value={cat._id} key={cat._id}>
										{cat.name}
									</option>
								);
							})}
					</select>
					<br />
					<button className='btn btn-outline-primary'>Update</button>
				</form>
			)}
		</>
	);
};

export default UpdateSubCategoryForm;
