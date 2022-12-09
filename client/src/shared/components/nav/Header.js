import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Badge } from 'antd';
import {
	AppstoreOutlined,
	UserOutlined,
	UserAddOutlined,
	SettingOutlined,
	LogoutOutlined,
	ShoppingOutlined,
	ShoppingCartOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

import { auth } from '../../../firebase';
import { toast } from 'react-toastify';
import Search from './Search';

const Header = () => {
	const [current, setCurrent] = useState('home');
	const dispatch = useDispatch();
	const { user, cart } = useSelector((state) => ({ ...state }));
	const navigate = useNavigate();

	const handleClick = (e) => {
		setCurrent(e.key);
	};

	const logout = () => {
		auth.signOut();
		dispatch({
			type: 'LOGOUT',
			payload: null,
		});
		toast.success('User logged out.');
		navigate('/login');
	};
	const menuItems = [
		{
			key: 'home',
			label: <Link to={'/'}>Home</Link>,
			icon: <AppstoreOutlined />,
		},
		{
			key: 'shop',
			label: <Link to={'/shop'}>Shop</Link>,
			icon: <ShoppingOutlined />,
		},
		{
			key: 'cart',
			label: (
				<Link to={'/cart'}>
					<Badge count={cart.length} offset={[9, 0]}>
						Cart
					</Badge>
				</Link>
			),
			icon: <ShoppingCartOutlined />,
		},
	];

	let registerItems;
	let width = 0;
	if (!user) {
		registerItems = [
			{
				key: 'register',
				label: <Link to={'/register'}>Register</Link>,
				icon: <UserAddOutlined />,
			},
			{
				key: 'login',
				label: <Link to={'/login'}>Login</Link>,
				icon: <UserOutlined />,
			},
		];
		width = 300;
	} else {
		registerItems = [
			{
				key: 'user',
				label: user.email && user.email.split('@')[0],
				icon: <SettingOutlined />,
				children: [
					{
						key: 'option1',
						label: (
							<Link
								to={
									user.role === 'admin'
										? '/admin/dashboard'
										: '/user/history'
								}>
								Dashboard
							</Link>
						),
					},
					{
						key: 'logout',
						label: 'Logout',
						onClick: () => logout(),
						icon: <LogoutOutlined />,
					},
				],
			},
		];
		width = 150;
	}
	return (
		<div style={{ display: 'flex' }}>
			<Menu
				mode='horizontal'
				defaultSelectedKeys={[current]}
				items={menuItems}
				onClick={handleClick}
				style={{
					width: '100%',
				}}
				subMenuOpenDelay={0.2}
				subMenuCloseDelay={0.2}
			/>
			<ul className='pt-2 ant-menu-overflow ant-menu ant-menu-root ant-menu-horizontal ant-menu-light'>
				<Search />
			</ul>
			<Menu
				mode='horizontal'
				defaultSelectedKeys={[current]}
				items={registerItems}
				onClick={handleClick}
				style={{ width: width, marginLeft: 'auto' }}
			/>
		</div>
	);
};
export default Header;
