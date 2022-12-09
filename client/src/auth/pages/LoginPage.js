import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	signInWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
} from 'firebase/auth';
import { Button } from 'antd';
import { MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

import { auth } from '../../firebase';
import { createOrUpdateUser } from '../controllers/auth';

const LoginPage = () => {
	const [email, setEmail] = useState('anliberant@gmail.com');
	const [password, setPassword] = useState('123456');
	const [loading, setLoading] = useState(false);
	let navigate = useNavigate();
	const dispatch = useDispatch();
	const provider = new GoogleAuthProvider();
	const { user } = useSelector((state) => ({ ...state }));

	const redirectLoggedInUser = (role) => {
		if (role === 'admin') {
			window.location = '/admin/dashboard';
		} else {
			//window.location = '/user/history';
			navigate(-2);
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const result = await signInWithEmailAndPassword(
				auth,
				email,
				password,
			).catch((error) => {
				setLoading(false);
				const errorMessage = error.message;
				toast.error(`Wrong email or password`);
				throw new Error(errorMessage);
			});
			const { user } = result;
			const idUserResult = await user.getIdTokenResult();

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
					toast.success(`User signed in successfully`);

					redirectLoggedInUser(res.data.role);
				})
				.catch((error) => {
					console.log(error);
				});
		} catch (err) {
			setLoading(false);
			toast.error(err.message);
			throw new Error(err.message);
		}
	};

	const googleLogin = async (e) => {
		e.preventDefault();
		try {
			const result = await signInWithPopup(auth, provider).catch(
				(err) => {
					setLoading(false);
					toast.error(err.message);
					throw new Error(err.message);
				},
			);
			const { user } = result;
			const idUserResult = await user.getIdTokenResult();
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
					toast.success(`User signed in successfully`);
					redirectLoggedInUser(res.data.role);
				})
				.catch((error) => {
					console.log(error);
				});
		} catch (err) {
			setLoading(false);
			toast.error(err.message);
			throw new Error(err.message);
		}
	};
	const loginForm = () => {
		return (
			<form onSubmit={handleSubmit}>
				<div className='form-group'>
					<input
						type='email'
						className='form-control'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='Your email address'
						autoFocus
					/>
				</div>
				<div className='form-group'>
					<input
						type='password'
						className='form-control'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder='password'
						autoFocus
					/>
				</div>
				<br />
				<Button
					type='primary'
					block
					shape='round'
					icon={<MailOutlined />}
					size='large'
					className='mb-3'
					onClick={handleSubmit}
					disabled={!email || password.length < 6}>
					Login With Email / Password
				</Button>
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
					{loading ? (
						<h4 className='text-danger'>Loading...</h4>
					) : (
						<h4>Login</h4>
					)}
					{loginForm()}
					<Button
						danger
						block
						shape='round'
						icon={<GoogleOutlined />}
						size='large'
						className='mb-3'
						onClick={googleLogin}>
						Login With Google
					</Button>
					<Link
						to='/forgot/password'
						className='float-end text-danger'>
						Forgot Password
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
