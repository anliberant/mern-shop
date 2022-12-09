import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import LoadingToRedirect from './LoadingToRedirect';
import { currentAdmin } from '../../auth/controllers/auth';

const AdminRoute = ({ children }) => {
	const { user } = useSelector((state) => ({ ...state }));
	const [confirm, setConfirm] = useState(false);

	useEffect(() => {
		if (!user || !user.token) {
			return;
		}
		(async () => {
			await currentAdmin(user.token)
				.then((result) => {
					console.log('CURRENT ADMIN RESPONSE', result);
					setConfirm(true);
				})
				.catch((error) => {
					console.log(error);
					setConfirm(false);
					throw new Error(error.message);
				});
		})();
	}, [user]);
	return confirm ? (
		children
	) : (
		<>
			<LoadingToRedirect />
		</>
	);
};

export default AdminRoute;
