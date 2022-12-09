import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
	isSignInWithEmailLink,
	signInWithEmailLink,
	updatePassword,
} from 'firebase/auth';
import { toast } from 'react-toastify';
import axios from 'axios';

import { auth } from '../../firebase';

const createOrUpdateUser = async (authtoken) => {
	return await axios.post(
		'http://localhost:3005/api/create-or-update-user',
		{},
		{
			headers: {
				authtoken,
			},
		},
	);
};

const RegisterCompletePage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email || !password) {
			toast.error('Email and password are required');
			return;
		}
		if (password.length < 6) {
			toast.error('Password must be at least 6 characters');
			return;
		}
		if (isSignInWithEmailLink(auth, window.location.href)) {
			let result;
			try {
				result = await signInWithEmailLink(
					auth,
					email,
					window.location.href,
				);
				if (result.user.emailVerified) {
					window.localStorage.removeItem('emailForRegistration');
					let user = auth.currentUser;
					let idUserResult;
					if (user) {
						try {
							await updatePassword(user, password);
						} catch (err) {
							toast.error(err.message);
							throw new Error(err.message);
						}
						idUserResult = await user.getIdTokenResult();
						console.log('User', user, idUserResult);
						await createOrUpdateUser(idUserResult.token)
							.then((res) => {
								console.log('res', res);
								dispatch({
									type: 'LOGGED_IN_USER',
									payload: {
										name: res.data.name,
										email: res.data.email,
										token: idUserResult.token,
										role: res.data.role,
										_id: res.data._id,
									},
								});
							})
							.catch((error) => {
								console.log(error);
							});
						navigate('/');
					}
				}
			} catch (error) {
				console.log('error', error);
				toast.error(error.message);
			}
		}
		// try {
		// 	const result = await signInWithEmailLink(
		// 		auth,
		// 		email,
		// 		window.location.href,
		// 	).catch((error) => {
		// 		const errorMessage = error.message;
		// 		throw new Error(errorMessage);
		// 	});

		// 	console.log('result: ' + result);
		// } catch (err) {
		// 	console.error(err);
		// }
	};

	useEffect(() => {
		const item = window.localStorage.getItem('emailForRegistration');
		item && setEmail(item);
	}, [email]);
	const registerCompleteForm = () => {
		return (
			<form onSubmit={handleSubmit}>
				<input
					type='email'
					id='email'
					className='form-control'
					value={email}
					disabled
				/>
				<input
					type='password'
					id='password'
					className='form-control'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder='Enter your password'
					autoFocus
				/>
				<button type='submit' className='btn btn-raised'>
					Complete Registration
				</button>
			</form>
		);
	};
	return (
		<div className='container p-5'>
			<div className='row'>
				<div className='col-md-6 offset-md-3'>
					<h4>Register</h4>
					{registerCompleteForm()}
				</div>
			</div>
		</div>
	);
};
export default RegisterCompletePage;
