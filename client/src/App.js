import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';

import { auth } from './firebase';

import { LoadingOutlined } from '@ant-design/icons';
import 'antd/dist/antd.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { currentUser } from './auth/controllers/auth';

const RegisterPage = lazy(() => import('./auth/pages/RegisterPage'));
const Home = lazy(() => import('./home/pages/HomePage'));
const Header = lazy(() => import('./shared/components/nav/Header'));
const LoginPage = lazy(() => import('./auth/pages/LoginPage'));
const SideDrawer = lazy(() => import('./cart/components/drawer/SideDrawer'));
const RegisterCompletePage = lazy(() =>
	import('./auth/pages/RegisterCompletePage'),
);
const ForgotPasswordPage = lazy(() => import('./auth/pages/ForgotPassword'));
const UserHistoryPage = lazy(() => import('./user/pages/HistoryPage'));
const UserRoute = lazy(() => import('./user/components/UserRoute'));
const PasswordPage = lazy(() => import('./user/pages/PasswordPage'));
const WhishListPage = lazy(() => import('./user/pages/WhishList'));
const AdminDashboardPage = lazy(() =>
	import('./admin/pages/dashboard/AdminDashboardPage'),
);
const CreateCategoryPage = lazy(() =>
	import('./admin/pages/categories/CreateCategoryPage'),
);
const UpdateCategoryPage = lazy(() =>
	import('./admin/pages/categories/UpdateCategoryPage'),
);
const CreateSubCategoryPage = lazy(() =>
	import('./admin/pages/categories/CreateSubCategoryPage'),
);
const UpdateSubCategoryPage = lazy(() =>
	import('./admin/pages/categories/UpdateSubCategoryPage'),
);
const CreateProductPage = lazy(() =>
	import('./admin/pages/products/CreateProductPage'),
);
const AdminProductsPage = lazy(() =>
	import('./admin/pages/products/AdminProductsPage'),
);
const UpdateProductPage = lazy(() =>
	import('./admin/pages/products/UpdateProductPage'),
);
const ProductPage = lazy(() => import('./home/pages/ProductPage'));
const CategoryPage = lazy(() => import('./shared/pages/CategoryPage'));
const SubCategoryPage = lazy(() => import('./shared/pages/SubCategoryPage'));
const ShopHomePage = lazy(() => import('./shop/pages/ShopHomePage'));
const CartPage = lazy(() => import('./cart/pages/CartPage'));
const CheckoutPage = lazy(() => import('./cart/pages/CheckoutPage'));
const CreateCouponPage = lazy(() =>
	import('./admin/pages/coupons/CreateCouponPage'),
);
const PaymentPage = lazy(() => import('./shared/pages/PaymentPage'));

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			if (user) {
				const idTokenResult = await user.getIdTokenResult();
				await currentUser(idTokenResult.token)
					.then((res) => {
						dispatch({
							type: 'LOGGED_IN_USER',
							payload: {
								name: res.data.name,
								email: res.data.email,
								token: idTokenResult.token,
								role: res.data.role,
								_id: res.data._id,
							},
						});
					})
					.catch((error) => {
						console.log(error);
					});
			}
		});
		return () => unsubscribe();
	}, [dispatch]);
	return (
		<Suspense
			fallback={
				<div className='col text-center p-5'>
					<LoadingOutlined />
				</div>
			}>
			<Header />
			<SideDrawer />
			<ToastContainer />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/register' element={<RegisterPage />} />
				<Route
					path='/register/complete'
					element={<RegisterCompletePage />}
				/>
				<Route
					path='/forgot/password'
					element={<ForgotPasswordPage />}
				/>
				<Route
					path='/user/history'
					element={
						<UserRoute>
							<UserHistoryPage />
						</UserRoute>
					}
				/>
				<Route path='/user/password' element={<PasswordPage />} />
				<Route path='/user/wishlist' element={<WhishListPage />} />
				<Route
					path='/admin/dashboard'
					element={<AdminDashboardPage />}
				/>
				<Route
					path='/admin/category'
					element={<CreateCategoryPage />}
				/>
				<Route
					path='/admin/category/:slug'
					element={<UpdateCategoryPage />}
				/>
				<Route path='/admin/coupons' element={<CreateCouponPage />} />
				<Route path='/admin/sub' element={<CreateSubCategoryPage />} />
				<Route
					path='/admin/sub/:slug'
					element={<UpdateSubCategoryPage />}
				/>
				<Route path='/admin/product' element={<CreateProductPage />} />

				<Route
					path='/admin/product/:slug'
					element={<UpdateProductPage />}
				/>
				<Route path='/admin/products' element={<AdminProductsPage />} />
				<Route path='/product/:slug' element={<ProductPage />} />
				<Route path='/category/:slug' element={<CategoryPage />} />
				<Route path='/sub/:slug' element={<SubCategoryPage />} />
				<Route path='/shop' element={<ShopHomePage />} />
				<Route path='/cart' element={<CartPage />} />
				<Route path='/checkout' element={<CheckoutPage />} />
				<Route path='/payment' element={<PaymentPage />} />
			</Routes>
		</Suspense>
	);
}

export default App;
