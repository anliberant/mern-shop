import React from 'react';

const UpdateCategoryForm = ({
	handleSubmit,
	setName,
	name,
	setCategorySlug,
	categorySlug,
}) => {
	return (
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
			<br />
			<button className='btn btn-outline-primary'>Update</button>
		</form>
	);
};

export default UpdateCategoryForm;
