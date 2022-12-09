import axios from 'axios';

const uploadImages = async (image, authtoken) => {
	return await axios
		.post(
			`${process.env.REACT_APP_BASE_API}/upload-img`,
			{ image },
			{
				headers: {
					authtoken,
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods':
						'GET,PUT,POST,DELETE,PATCH,OPTIONS',
				},
			},
		)
		.catch((error) => {
			console.log('error: ' + error.message);
			throw new Error(error.message);
		});
};

const removeImage = async (imageId, authtoken) => {
	return await axios.post(
		`${process.env.REACT_APP_BASE_API}/remove-img/`,
		{ imageId },
		{
			headers: {
				authtoken,
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods':
					'GET,PUT,POST,DELETE,PATCH,OPTIONS',
			},
		},
	);
};

export { uploadImages, removeImage };
