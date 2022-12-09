import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminNav = () => {
	return (
		<nav>
			<ul className='nav flex-column'>
				<NavLink to='/admin/dashboard' className='nav-link'>
					Dashboard
				</NavLink>
			</ul>
			<ul className='nav flex-column'>
				<NavLink to='/admin/product' className='nav-link'>
					Product
				</NavLink>
			</ul>
			<ul className='nav flex-column'>
				<NavLink to='/admin/products' className='nav-link'>
					Products
				</NavLink>
			</ul>
			<ul className='nav flex-column'>
				<NavLink to='/admin/category' className='nav-link'>
					Category
				</NavLink>
			</ul>
			<ul className='nav flex-column'>
				<NavLink to='/admin/sub' className='nav-link'>
					Sub Category
				</NavLink>
			</ul>
			<ul className='nav flex-column'>
				<NavLink to='/admin/coupons' className='nav-link'>
					Coupons
				</NavLink>
			</ul>
			<ul className='nav flex-column'>
				<NavLink to='/user/password' className='nav-link'>
					Password
				</NavLink>
			</ul>
		</nav>
	);
};
export default AdminNav;
