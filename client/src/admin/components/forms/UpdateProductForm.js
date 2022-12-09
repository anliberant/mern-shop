import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getSubCategoriesById } from '../../controllers/subCategory';

const UpdateProductForm = ({
	handleSubmit,
	title,
	setTitle,
	description,
	setDescription,
	price,
	setPrice,
	category,
	categories,
	setCategory,
	subCategory,
	setSubCategory,
	quantity,
	setQuantity,
	shipping,
	setShipping,
	color,
	setColor,
	colors,
	brand,
	setBrand,
	brands,
	isChanged,
	setIsChanged,
}) => {
	const [subCategories, setSubCategories] = useState([]);

	useEffect(() => {
		(async () => {
			if (!category) {
				return;
			}
			try {
				await getSubCategoriesById(category)
					.then((res) => {
						setSubCategories(res.data);
					})
					.catch((err) => {
						setSubCategories([]);
						toast.error(err.message);
						throw new Error(err.message);
					});
			} catch (err) {
				toast.error(err.message);
				throw new Error(err.message);
			}
		})();
	}, [category]);
	return (
		<form onSubmit={handleSubmit} onChange={() => setIsChanged(true)}>
			<div className='form-group'>
				<label>Title</label>
				<input
					className='form-control'
					value={title}
					type='text'
					name='title'
					onChange={(e) => {
						setTitle(e.target.value);
					}}
				/>
			</div>
			<div className='form-group'>
				<label>Description</label>
				<textarea
					className='form-control'
					name='description'
					defaultValue={description}
					onChange={(e) => setDescription(e.target.value)}></textarea>
			</div>
			<div className='form-group'>
				<label>Price</label>
				<input
					className='form-control'
					value={price}
					type='Number'
					name='price'
					onChange={(e) => setPrice(parseFloat(e.target.value))}
				/>
			</div>
			<div className='form-group'>
				<label>Category</label>
				<select
					className='form-control'
					name='category'
					onChange={(e) => setCategory(e.target.value)}
					value={category}>
					<option>PLEASE SELECT</option>
					{categories.map((cat) => {
						return (
							<option value={cat._id} key={cat._id}>
								{cat.name}
							</option>
						);
					})}
				</select>
			</div>
			{subCategories.length > 0 && (
				<div className='form-group'>
					<label>Sub Category</label>
					<select
						className='form-control'
						name='sub'
						value={subCategory ? subCategory : ''}
						onChange={(e) => setSubCategory(e.target.value)}>
						<option>PLEASE SELECT</option>
						{subCategories.map((sub) => {
							return (
								<option value={sub._id} key={sub._id}>
									{sub.name}
								</option>
							);
						})}
					</select>
				</div>
			)}
			<div className='form-group'>
				<label>Quantity</label>
				<input
					className='form-control'
					value={quantity}
					type='Number'
					name='quantity'
					onChange={(e) => setQuantity(parseFloat(e.target.value))}
				/>
			</div>
			<div className='form-group'>
				<label>Shipping</label>
				<select
					className='form-control'
					name='shipping'
					value={shipping}
					onChange={(e) => setShipping(e.target.value)}>
					<option value={'yes'}>Yes</option>
					<option value={'no'}>No</option>
				</select>
			</div>
			<div className='form-group'>
				<label>Color</label>
				<select
					className='form-control'
					name='color'
					value={color}
					onChange={(e) => setColor(e.target.value)}>
					<option value={'default'}>PLEASE SELECT</option>
					{colors.map((col) => {
						return (
							<option value={col} key={col}>
								{col}
							</option>
						);
					})}
				</select>
			</div>
			<div className='form-group'>
				<label>Brand</label>
				<select
					className='form-control'
					name='brand'
					value={brand}
					onChange={(e) => setBrand(e.target.value)}>
					<option value={'default'}>PLEASE SELECT</option>
					{brands.map((brd) => {
						return (
							<option value={brd} key={brd}>
								{brd}
							</option>
						);
					})}
				</select>
			</div>
			<button
				className='btn-outline-info mt-3'
				style={{ cursor: isChanged ? 'pointer' : 'default' }}
				type='submit'
				disabled={!isChanged}>
				Update
			</button>
		</form>
	);
};
export default UpdateProductForm;
