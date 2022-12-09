import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Slider, Checkbox } from 'antd';
import {
	DollarOutlined,
	DownSquareOutlined,
	StarOutlined,
} from '@ant-design/icons';

import { getCategories } from '../../admin/controllers/category';
import { getSubCategories } from '../../admin/controllers/subCategory';
import {
	getFilteredProducts,
	getProducts,
} from '../../admin/controllers/product';
import Star from '../../home/components/Star';

const FilterMenu = ({ setProducts }) => {
	const dispatch = useDispatch();
	const { search } = useSelector((state) => ({ ...state }));
	const { text } = search;

	const [loading, setLoading] = useState(false);
	const [price, setPrice] = useState([20, 4999]);
	const [isPriceChanged, setIsPriceChanged] = useState(false);
	const [categories, setCategories] = useState([]);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [subCategories, setSubCategories] = useState([]);
	const [brands, setBrands] = useState([
		'Apple',
		'Sumsung',
		'Microsoft',
		'Lenovo',
		'ASUS',
	]);
	const [colors, setColors] = useState([
		'Black',
		'White',
		'Brown',
		'Silver',
		'Green',
		'Yellow',
		'Blue',
	]);
	const [shippings, setShippings] = useState(['yes', 'no']);

	const listCategories = () => {
		if (categories && categories.length > 0) {
			let newCategories = categories.map((cat) => {
				return {
					key: cat.name,
					label: (
						<div key={cat._id}>
							<Checkbox
								name={'category'}
								defaultChecked={false}
								checked={
									selectedCategories.indexOf(cat._id) === -1
										? false
										: true
								}
								onChange={(e) =>
									handleCheckboxChange(e, cat._id)
								}>
								{cat.name}
							</Checkbox>
							<br />
						</div>
					),
				};
			});
			return newCategories;
		}
	};

	const handleCheckboxChange = async (e, catId) => {
		setPrice([20, 4999]);
		setSelectedCategories([]);
		dispatch({
			type: 'SEARCH_QUERY',
			payload: { text: '' },
		});
		let clonedCats = [];
		if (selectedCategories && selectedCategories.length > 0) {
			clonedCats = [...selectedCategories];
			if (e.target.checked) {
				clonedCats.push(catId);
			} else {
				clonedCats = clonedCats.filter((c) => c !== catId);
			}
		} else {
			clonedCats.push(catId);
		}
		setSelectedCategories(clonedCats);
		let allProducts;
		await getProducts().then((res) => {
			allProducts = res.data;
		});
		let products = await allProducts.filter((product) => {
			if (clonedCats.length === 0) {
				return true;
			}
			return clonedCats.indexOf(product.category._id) !== -1;
		});
		setProducts(products);
	};

	const starsHandler = async (stars) => {
		setPrice([20, 4999]);
		setSelectedCategories([]);
		dispatch({
			type: 'SEARCH_QUERY',
			payload: { text: '' },
		});
		await getFilteredProducts({ stars })
			.then((res) => {
				setProducts(res.data);
			})
			.catch((err) => {
				return new Error(err.message);
			});
	};
	const listStars = () => {
		let stars = [5, 4, 3, 2, 1].map((star) => {
			return {
				key: star,
				label: (
					<div key={star}>
						<Star
							starsNumber={star}
							starsHandler={starsHandler}
							readonly={true}
						/>
						<br />
					</div>
				),
			};
		});
		return stars;
	};
	const setSubCategory = async (e, sub) => {
		e.preventDefault();
		setPrice([20, 4999]);
		setSelectedCategories([]);
		dispatch({
			type: 'SEARCH_QUERY',
			payload: { text: '' },
		});
		await getFilteredProducts({ sub })
			.then((res) => {
				setProducts(res.data);
			})
			.catch((err) => {
				return new Error(err.message);
			});
	};
	const setBrand = async (e, brand) => {
		e.preventDefault();
		setPrice([20, 4999]);
		setSelectedCategories([]);
		dispatch({
			type: 'SEARCH_QUERY',
			payload: { text: '' },
		});
		await getFilteredProducts({ brand })
			.then((res) => {
				setProducts(res.data);
			})
			.catch((err) => {
				return new Error(err.message);
			});
	};
	const setColor = async (e, color) => {
		e.preventDefault();
		setPrice([20, 4999]);
		setSelectedCategories([]);
		dispatch({
			type: 'SEARCH_QUERY',
			payload: { text: '' },
		});
		await getFilteredProducts({ color })
			.then((res) => {
				setProducts(res.data);
			})
			.catch((err) => {
				return new Error(err.message);
			});
	};
	const setShipping = async (e, shipping) => {
		e.preventDefault();
		setPrice([20, 4999]);
		setSelectedCategories([]);
		dispatch({
			type: 'SEARCH_QUERY',
			payload: { text: '' },
		});
		await getFilteredProducts({ shipping })
			.then((res) => {
				setProducts(res.data);
			})
			.catch((err) => {
				return new Error(err.message);
			});
	};
	const listSubs = () => {
		if (!subCategories || subCategories.length < 0) {
			return;
		}
		let subs = subCategories.map((sub) => {
			return {
				key: sub.name,
				label: (
					<span
						key={sub._id}
						onClick={(e) => setSubCategory(e, sub._id)}>
						{sub.name}
					</span>
				),
			};
		});
		return subs;
	};
	const listBrands = () => {
		let allBrands = brands.map((brand) => {
			return {
				key: brand,
				label: (
					<span key={brand} onClick={(e) => setBrand(e, brand)}>
						{brand}
					</span>
				),
			};
		});
		return allBrands;
	};
	const listColors = () => {
		let allColors = colors.map((color) => {
			return {
				key: color,
				label: (
					<div key={color} onClick={(e) => setColor(e, color)}>
						{color}
					</div>
				),
			};
		});
		return allColors;
	};
	const listShipping = () => {
		let allShipping = shippings.map((shipping) => {
			return {
				key: shipping,
				label: (
					<div
						key={shipping}
						onClick={(e) => setShipping(e, shipping)}>
						{shipping}
					</div>
				),
			};
		});
		return allShipping;
	};

	const sliderHandler = (val) => {
		setPrice(val);
		dispatch({
			type: 'SEARCH_QUERY',
			payload: { text: '' },
		});
		setSelectedCategories([]);
		let timeoutId = setTimeout(() => {
			setIsPriceChanged(true);
			clearTimeout(timeoutId);
		}, 300);
	};
	const menuItems = [
		{
			key: 'slider',
			label: 'Price',
			icon: <DollarOutlined />,
			children: [
				{
					key: 'price',
					label: (
						<div className='icon-wrapper'>
							<Slider
								range
								defaultValue={price}
								value={price}
								disabled={false}
								onChange={(val) => sliderHandler(val)}
								max={4999}
							/>
						</div>
					),
				},
			],
		},
		{
			key: 'categories',
			label: 'Categories',
			icon: <DownSquareOutlined />,
			children: listCategories(),
		},
		{
			key: 'stars',
			label: 'Stars',
			icon: <StarOutlined />,
			children: listStars(),
		},
		{
			key: 'subs',
			label: 'SubCategories',
			icon: <DownSquareOutlined />,
			children: listSubs(),
		},
		{
			key: 'brands',
			label: 'Brands',
			icon: <DownSquareOutlined />,
			children: listBrands(),
		},
		{
			key: 'colors',
			label: 'Colors',
			icon: <DownSquareOutlined />,
			children: listColors(),
		},
		{
			key: 'shipping',
			label: 'Shipping',
			icon: <DownSquareOutlined />,
			children: listShipping(),
		},
	];

	//LOAD CATEGORIES

	useEffect(() => {
		(async () => {
			setLoading(true);
			await getCategories()
				.then((res) => {
					setCategories(res.data);
					setLoading(false);
				})
				.catch((err) => {
					setLoading(false);
					throw new Error(err.message);
				});
		})();
	}, []);

	// LOAD SUB CATEGORIES

	useEffect(() => {
		(async () => {
			setLoading(true);
			await getSubCategories()
				.then((res) => {
					setSubCategories(res.data);
					setLoading(false);
				})
				.catch((err) => {
					setLoading(false);
					throw new Error(err.message);
				});
		})();
	}, []);

	// LOAD PRODUCTS ON USER SEARCH INPUT

	useEffect(() => {
		setSelectedCategories([]);
		setPrice([20, 4999]);
		(async () => {
			setLoading(true);
			const timeoutId = setTimeout(async () => {
				await getFilteredProducts({ text })
					.then((res) => {
						setProducts(res.data);
						setLoading(false);
					})
					.catch((err) => {
						setLoading(false);
						throw new Error(err.message);
					});
			}, 300);
			return () => clearTimeout(timeoutId);
		})();
	}, [text]);

	useEffect(() => {
		setSelectedCategories([]);
		dispatch({
			type: 'SEARCH_QUERY',
			payload: { text: '' },
		});
		(async () => {
			await getFilteredProducts({ price })
				.then((res) => {
					setProducts(res.data);
					setLoading(false);
				})
				.catch((err) => {
					setLoading(false);
					throw new Error(err.message);
				});
			setIsPriceChanged(false);
		})();
	}, [isPriceChanged]);

	return (
		<Menu
			items={menuItems}
			defaultOpenKeys={[
				'slider',
				'categories',
				'stars',
				'subs',
				'brands',
				'colors',
				'shipping',
			]}
			mode='inline'></Menu>
	);
};
export default FilterMenu;
