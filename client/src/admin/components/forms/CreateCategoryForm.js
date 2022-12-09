import React from 'react';

const CreateCategoryForm = ({ handleSubmit, name, setName }) => {
	return (
		<form onSubmit={handleSubmit}>
			<input
				type='text'
				name='category'
				className='form-control'
				onChange={(e) => setName(e.target.value)}
				value={name}
				autoFocus
				required
			/>
			<br />
			<button className='btn btn-outline-primary'>Save</button>
		</form>
	);
};
export default CreateCategoryForm;
