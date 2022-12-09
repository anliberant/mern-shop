import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useSelector } from 'react-redux';

import { toast } from 'react-toastify';

import { auth } from '../../firebase';

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { user } = useSelector((state) => ({ ...state }));

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await sendPasswordResetEmail(auth, email, {
				url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL,
				handleCodeInApp: true,
			})
				.then(() => {
					setEmail('');
					setLoading(false);
					toast.success('Check your email for password reset link');
				})
				.catch((err) => {
					setLoading(false);
					toast.error(err.message);
					throw new Error(err.message);
				});
		} catch (err) {
			setLoading(false);
			toast.error(err.message);
			throw new Error(err.message);
		}
	};

	useEffect(() => {
		if (user && user.token) {
			navigate('/');
		}
	}, [user, navigate]);

	return (
		<div className='container col-md-6 offset-md-3 p-5'>
			{loading ? (
				<h4>Loading...</h4>
			) : (
				<h4 className='text-danger'>Forgot Password</h4>
			)}
			<form onSubmit={(e) => handleSubmit(e)}>
				<input
					type='email'
					className='form-control'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder='Type your email'
					autoFocus
				/>
				<br />
				<button className='btn btn-raised' disabled={!email}>
					Submit
				</button>
			</form>
		</div>
	);
};
export default ForgotPasswordPage;
