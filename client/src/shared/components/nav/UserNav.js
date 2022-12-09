import React from 'react';
import { NavLink } from 'react-router-dom';

const UserNav = () => {
	return (
		<nav>
			<ul className='nav flex-column'>
				<NavLink to='/user/history' className='nav-link'>
					History
				</NavLink>
			</ul>
			<ul className='nav flex-column'>
				<NavLink to='/user/password' className='nav-link'>
					Password
				</NavLink>
			</ul>
			<ul className='nav flex-column'>
				<NavLink to='/user/wishlist' className='nav-link'>
					Wishlist
				</NavLink>
			</ul>
		</nav>
	);
};
export default UserNav;
