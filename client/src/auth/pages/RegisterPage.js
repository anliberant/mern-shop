import React, { useEffect, useState } from 'react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { auth } from '../../firebase';

const RegisterPage = () => {
	const [email, setEmail] = useState('');
	const navigate = useNavigate();
	const { user } = useSelector((state) => ({ ...state }));

	const handleSubmit = async (e) => {
		e.preventDefault();
		const config = {
			url: 'http://localhost:3000/register/complete',
			handleCodeInApp: true,
		};
		await sendSignInLinkToEmail(auth, email, config).catch((error) => {
			const errorMessage = error.message;
			throw new Error(errorMessage);
		});
		toast.success(
			`Email sent to ${email}. Click the link to complete your registration.`,
		);
		window.localStorage.setItem('emailForRegistration', email);
		setEmail('');
	};

	const registerForm = () => {
		return (
			<form onSubmit={handleSubmit}>
				<input
					type='email'
					className='form-control'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder='Your email address'
					autoFocus
				/>
				<br />
				<button type='submit' className='btn btn-raised'>
					Register
				</button>
			</form>
		);
	};
	useEffect(() => {
		if (user && user.token) {
			navigate('/');
		}
	}, [user, navigate]);
	return (
		<div className='container p-5'>
			<div className='row'>
				<div className='col-md-6 offset-md-3'>
					<h4>Register</h4>
					{registerForm()}
				</div>
			</div>
		</div>
	);
};
export default RegisterPage;
