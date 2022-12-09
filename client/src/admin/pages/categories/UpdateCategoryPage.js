import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import { getCategory, updateCategory } from '../../controllers/category';
import AdminNav from '../../components/nav/AdminNav';
import UpdateCategoryForm from '../../components/forms/UpdateCategoryForm';

const UpdateCategoryPage = () => {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { user } = useSelector((state) => ({ ...state }));

	const [name, setName] = useState('');
	const [categorySlug, setCategorySlug] = useState(slug);
	const [loading, setLoading] = useState(false);
	const [updatedCategory, setUpdatedCategory] = useState({});

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name && !slug) {
			return;
		}
		const candidateCategory = {
			name: name || '',
			categorySlug: categorySlug || '',
		};
		setUpdatedCategory(candidateCategory);
		setLoading(true);
		await updateCategory(slug, updatedCategory, user.token)
			.then((res) => {
				setLoading(false);
				toast.success('Category updated successfully');
				navigate('/admin/category');
			})
			.catch((err) => {
				setLoading(false);
				toast.error('Error updating category');
				throw new Error(err.message);
			});
	};

	useEffect(() => {
		(async () => {
			setLoading(true);
			const category = await getCategory(slug);
			setLoading(false);
			if (!category) {
				return;
			}
			setName(category.data.name);
			setCategorySlug(category.data.slug);
		})();
	}, [slug]);
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
						<h4>{`Update Category ${updateCategory.name}`}</h4>
					)}
					<UpdateCategoryForm
						handleSubmit={handleSubmit}
						setName={setName}
						name={name}
						setCategorySlug={setCategorySlug}
						categorySlug={categorySlug}
					/>
				</div>
			</div>
		</div>
	);
};

export default UpdateCategoryPage;
