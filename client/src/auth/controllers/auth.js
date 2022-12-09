import axios from 'axios';

const createOrUpdateUser = async (authtoken) => {
	return await axios.post(
		`${process.env.REACT_APP_BASE_API}/create-or-update-user`,
		{},
		{
			headers: {
				authtoken,
			},
		},
	);
};

const currentUser = async (authtoken) => {
	return await axios.post(
		`${process.env.REACT_APP_BASE_API}/current-user`,
		{},
		{
			headers: {
				authtoken,
			},
		},
	);
};

const redirectLoggedInUser = async (authtoken) => {
	return await axios.post(
		`${process.env.REACT_APP_BASE_API}/redirect-logged-in-user`,
		{},
		{
			headers: {
				authtoken,
			},
		},
	);
};

const currentAdmin = async (authtoken) => {
	return await axios.post(
		`${process.env.REACT_APP_BASE_API}/current-admin`,
		{},
		{
			headers: {
				authtoken,
			},
		},
	);
};

export { createOrUpdateUser, currentUser, redirectLoggedInUser, currentAdmin };
