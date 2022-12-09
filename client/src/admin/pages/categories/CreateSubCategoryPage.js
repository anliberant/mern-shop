import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { getCategories } from '../../controllers/category';
import AdminNav from '../../components/nav/AdminNav';
import {
	createSubCategory,
	removeSubCategory,
	getSubCategories,
} from '../../controllers/subCategory';
import CreateCategoryForm from '../../components/forms/CreateCategoryForm';
import LocalSearch from '../../controllers/localSearch';

const CreateSubCategoryPage = () => {
	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState([]);
	const [query, setQuery] = useState('');
	const [parentCategory, setParentCategory] = useState('');
	const [subCategories, setSubCategories] = useState([]);

	const { user } = useSelector((state) => ({ ...state }));

	const loadCategories = () => {
		getCategories()
			.then((categories) => setCategories(categories.data))
			.catch((err) => {
				toast.error(err.message);
				throw new Error(err.message);
			});
	};
	const loadSubCategories = () => {
		getSubCategories()
			.then((subs) => setSubCategories(subs.data))
			.catch((err) => {
				toast.error(err.message);
				throw new Error(err.message);
			});
	};
	const handleRemoveSubCategory = async (slug) => {
		if (window.confirm('Are you sure you want to remove')) {
			setLoading(true);
			try {
				await removeSubCategory(slug, user.token);
				setLoading(false);
				toast.success('Category removed successfully');
				loadCategories();
				loadSubCategories();
			} catch (err) {
				setLoading(false);
				toast.error(err.message);
				throw new Error(err.message);
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await createSubCategory(
				{ name, parent: parentCategory },
				user.token,
			).then(() => {
				setLoading(false);
				setName('');
				toast.success('Category created successfully');
				loadCategories();
				loadSubCategories();
			});
		} catch (err) {
			setLoading(false);
			toast.error(err.message);
			throw new Error(err.message);
		}
	};

	const searched = (query) => (c) => c.name.toLowerCase().includes(query);

	useEffect(() => {
		loadCategories();
		loadSubCategories();
	}, [parentCategory]);
	return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-md-2'>
					<AdminNav />
				</div>
				<div className='col'>
					{loading ? (
						<h4 className='text-danger'>Loading...</h4>
					) : (
						<h4>Create SubCategory</h4>
					)}
					<div className='form-group'>
						<label>Parent Category</label>
						<select
							name='category'
							className='form-control'
							onChange={(e) => setParentCategory(e.target.value)}>
							<option>PLEASE SELECT</option>
							{categories.length &&
								categories.map((cat) => {
									return (
										<option value={cat._id} key={cat._id}>
											{cat.name}
										</option>
									);
								})}
							<option value='' />
						</select>
					</div>
					<CreateCategoryForm
						handleSubmit={handleSubmit}
						name={name}
						setName={setName}
					/>
					<LocalSearch query={query} setQuery={setQuery} />
					<hr />
					{subCategories.length &&
						subCategories
							.filter(searched(query))
							.map((subCategory) => {
								if (subCategory.parent === parentCategory) {
									return (
										<div
											className='alert alert-secondary d-flex justify-space-between'
											key={subCategory._id}>
											<div className='col-8'>
												{subCategory.name}
											</div>
											<div className='col-6 col-offset-2'>
												<span
													className='btn btn-sm float-right'
													onClick={() => {
														handleRemoveSubCategory(
															subCategory.slug,
														);
													}}>
													<DeleteOutlined />
												</span>
												<Link
													to={`/admin/sub/${subCategory.slug}`}>
													<span className='btn btn-sm float-right'>
														<EditOutlined />
													</span>
												</Link>
											</div>
										</div>
									);
								} else {
									return false;
								}
							})}
				</div>
			</div>
		</div>
	);
};
export default CreateSubCategoryPage;
