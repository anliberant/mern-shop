import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import {
	getCategories,
	removeCategory,
	createCategory,
} from '../../controllers/category';
import AdminNav from '../../components/nav/AdminNav';
import CreateCategoryForm from '../../components/forms/CreateCategoryForm';
import LocalSearch from '../../controllers/localSearch';

const CreateCategoryPage = () => {
	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState([]);
	const [query, setQuery] = useState('');

	const { user } = useSelector((state) => ({ ...state }));

	const loadCategories = () => {
		getCategories()
			.then((categories) => setCategories(categories.data))
			.catch((err) => {
				toast.error(err.message);
				throw new Error(err.message);
			});
	};
	const handleRemoveCategory = async (slug) => {
		if (window.confirm('Are you sure you want to remove')) {
			setLoading(true);
			try {
				await removeCategory(slug, user.token);
				setLoading(false);
				toast.success('Category removed successfully');
				loadCategories();
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
			await createCategory({ name }, user.token).then(() => {
				setLoading(false);
				setName('');
				toast.success('Category created successfully');
				loadCategories();
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
	}, []);
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
						<h4>Create Category</h4>
					)}
					<CreateCategoryForm
						handleSubmit={handleSubmit}
						name={name}
						setName={setName}
					/>
					<LocalSearch query={query} setQuery={setQuery} />
					<hr />
					{categories.filter(searched(query)).map((category) => {
						return (
							<div
								className='alert alert-secondary d-flex justify-space-between'
								key={category._id}>
								<div className='col-8'>{category.name}</div>
								<div className='col-6 col-offset-2'>
									<span
										className='btn btn-sm float-right'
										onClick={() => {
											handleRemoveCategory(category.slug);
										}}>
										<DeleteOutlined />
									</span>
									<Link
										to={`/admin/category/${category.slug}`}>
										<span className='btn btn-sm float-right'>
											<EditOutlined />
										</span>
									</Link>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
export default CreateCategoryPage;
