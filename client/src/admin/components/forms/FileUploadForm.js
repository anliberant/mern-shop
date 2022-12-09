import React from 'react';
import Resizer from 'react-image-file-resizer';
import { useSelector } from 'react-redux';
import { Avatar, Badge } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

import { uploadImages, removeImage } from '../../controllers/uploadImages';

const resizeFile = (file) =>
	new Promise((resolve) => {
		Resizer.imageFileResizer(
			file,
			300,
			300,
			'JPEG',
			100,
			0,
			(uri) => {
				resolve(uri);
			},
			'base64',
		);
	});

const FileUploadForm = ({
	images,
	setImages,
	loading,
	setLoading,
	setIsChanged,
}) => {
	const { user } = useSelector((state) => ({ ...state }));

	const handleImgRemove = async (event, id) => {
		event.preventDefault();
		setLoading(true);
		try {
			setLoading(true);
			await removeImage(id, user ? user.token : '');
			setLoading(false);
			let allImages = images.filter((image) => image.public_id !== id);
			setImages(allImages);
			toast.success('Image removed successfully');
		} catch (err) {
			setLoading(false);
			toast.error(err.message);
			throw err;
		}
	};

	const fileUploadAndResize = async (e) => {
		const files = e.target.files;
		const allImages = images;
		if (files) {
			setLoading(true);
			for (let i = 0; i < files.length; i++) {
				let image = await resizeFile(files[i]);
				uploadImages(image, user ? user.token : '')
					.then((res) => {
						setLoading(false);
						//setImages(res.data);
						setIsChanged(true);
						allImages.push(res.data);
					})
					.catch((err) => {
						setLoading(false);
					});
			}
		}
	};

	return (
		<>
			<div className='row'>
				{images.length > 0 &&
					images.map((img) => {
						return (
							// eslint-disable-next-line jsx-a11y/anchor-is-valid
							<a
								href=''
								key={img.public_id}
								onClick={(e) =>
									handleImgRemove(e, img.public_id)
								}>
								<Badge count={'X'} className='pr-0'>
									<Avatar
										src={img.url}
										size='large'
										className='ml-3'
										shape={'square'}
									/>
								</Badge>
							</a>
						);
					})}
			</div>
			<div className='row'>
				{loading ? (
					<LoadingOutlined />
				) : (
					<label className='btn btn-primary'>
						Choose File
						<input
							type='file'
							accept='images/*'
							onChange={(e) => {
								fileUploadAndResize(e);
							}}
							multiple
						/>
					</label>
				)}
			</div>
		</>
	);
};
export default FileUploadForm;
