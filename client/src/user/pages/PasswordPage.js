import React, { useState } from 'react';
import UserNav from '../../shared/components/nav/UserNav';
import { updatePassword } from 'firebase/auth';
import { toast } from 'react-toastify';

import { auth } from '../../firebase';

const PasswordPage = () => {
	//const auth = getAuth();
	const user = auth.currentUser;
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const onFormSubmit = async (e) => {
		e.preventDefault();

		if (auth && user) {
			setLoading(true);
			await updatePassword(user, password)
				.then(() => {
					toast.success('Password updated successfully');
					setPassword('');
				})
				.catch((err) => {
					toast.error(err.message);
					throw new Error(err.message);
				});
			setLoading(false);
		}
	};

	const passwordUpdateForm = () => {
		return (
			<form onSubmit={onFormSubmit}>
				<div className='form-group'>
					<label>Your password</label>
					<input
						autoComplete=''
						type='password'
						className='form-control'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder='Enter new password'
						disabled={loading}
					/>
					<button
						className='btn btn-primary'
						disabled={!password || loading || password.length < 6}>
						Submit
					</button>
				</div>
			</form>
		);
	};
	return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-md-2'>
					<UserNav />
				</div>
				<div className='col'>
					{loading ? (
						<h4 className='text-danger'>Loading...</h4>
					) : (
						<h4>Password Update</h4>
					)}
					{passwordUpdateForm()}
				</div>
			</div>
		</div>
	);
};
export default PasswordPage;
