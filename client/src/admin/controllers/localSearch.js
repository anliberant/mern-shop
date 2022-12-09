import React from 'react';

const LocalSearch = ({ query, setQuery }) => {
	const handleSearchChange = (e) => {
		e.preventDefault();
		setQuery(e.target.value.toLowerCase());
	};
	return (
		<div className='container pt-4 pb-4'>
			<input
				type='search'
				placeholder='Filter'
				value={query}
				onChange={handleSearchChange}
			/>
		</div>
	);
};

export default LocalSearch;
