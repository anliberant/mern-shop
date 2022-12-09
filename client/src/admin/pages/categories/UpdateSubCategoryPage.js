import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import AdminNav from '../../components/nav/AdminNav';
import {
	getSubCategory,
	updateSubCategory,
} from '../../controllers/subCategory';
import UpdateSubCategoryForm from '../../components/forms/UpdateSubCategoryForm';

const UpdateSubCategoryPage = () => {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { user } = useSelector((state) => ({ ...state }));

	const [name, setName] = useState('');
	const [categorySlug, setCategorySlug] = useState(slug);
	const [loading, setLoading] = useState(false);
	const [parent, setParent] = useState('');
	const [updatedSubCategory, setUpdatedSubCategory] = useState({});

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name && !slug && !parent) {
			return;
		}
		const candidateSubCategory = {
			name: name || '',
			categorySlug: categorySlug || '',
			parent,
		};
		setUpdatedSubCategory(candidateSubCategory);
		setLoading(true);
		await updateSubCategory(slug, updatedSubCategory, user.token)
			.then((res) => {
				console.log('res', res);
				setLoading(false);
				toast.success('Category updated successfully');
				if (res.data) {
					navigate(`/admin/sub/`);
				}
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
			const subCategory = await getSubCategory(slug);
			setLoading(false);
			if (!subCategory) {
				return;
			}
			setName(subCategory.data.name);
			setCategorySlug(subCategory.data.slug);
			setParent(subCategory.data.parent);
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
						<h4>{`Update Category ${name}`}</h4>
					)}
					<UpdateSubCategoryForm
						handleSubmit={handleSubmit}
						setName={setName}
						name={name}
						parent={parent}
						setParent={setParent}
						setCategorySlug={setCategorySlug}
						categorySlug={categorySlug}
					/>
				</div>
			</div>
		</div>
	);
};

export default UpdateSubCategoryPage;
