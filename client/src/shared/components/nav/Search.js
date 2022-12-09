import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';

const Search = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { search } = useSelector((state) => {
		return { ...state };
	});
	const { text } = search;

	const handleChange = (e) => {
		dispatch({
			type: 'SEARCH_QUERY',
			payload: { text: e.target.value },
		});
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		navigate(`/shop?${text}`);
	};

	return (
		<form
			className='d-inline-flex my-lg-0 px-3'
			style={{ maxHeight: 50 }}
			onSubmit={(e) => handleSubmit(e)}>
			<input
				type='search'
				value={text}
				className='form-control mr-sm-2'
				placeholder='Search'
				onChange={(e) => handleChange(e)}
			/>
			<SearchOutlined
				onClick={handleSubmit}
				style={{ cursor: 'pointer', margin: 'auto', paddingLeft: 10 }}
			/>
		</form>
	);
};
export default Search;
