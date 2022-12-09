import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import { StarOutlined } from '@ant-design/icons';

const RatingModal = ({ children }) => {
	const { user } = useSelector((state) => ({ ...state }));
	const navigate = useNavigate();
	const [isVisible, setIsVisible] = useState(false);

	const handleModal = () => {
		if (user && user.token) {
			setIsVisible(true);
		} else {
			navigate('/login');
		}
	};
	return (
		<>
			<div onClick={handleModal}>
				<StarOutlined className='text-danger' />
				<br />
				{user ? 'Leave rating' : 'Login to leave rating'}
			</div>
			<Modal
				centered
				open={isVisible}
				title='Leave your rating'
				onOk={() => {
					setIsVisible(false);
					toast.success('Thanks for you rating');
				}}
				onCancel={() => setIsVisible(false)}>
				{children}
			</Modal>
		</>
	);
};
export default RatingModal;
