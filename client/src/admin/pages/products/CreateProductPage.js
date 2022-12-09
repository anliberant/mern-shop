import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CreateProductForm from '../../components/forms/CreateProductForm';
import FileUploadForm from '../../components/forms/FileUploadForm';

import AdminNav from '../../components/nav/AdminNav';
import { getCategories } from '../../controllers/category';
import { createProduct } from '../../controllers/product';

const CreateProductPage = () => {
	const [loading, setLoading] = useState(false);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState(0);
	const [category, setCategory] = useState('');
	const [categories, setCategories] = useState([]);
	const [subCategory, setSubCategory] = useState('');
	const [quantity, setQuantity] = useState(0);
	const [shipping, setShipping] = useState('');
	const [images, setImages] = useState([]);
	const [colors] = useState([
		'Black',
		'White',
		'Brown',
		'Silver',
		'Green',
		'Yellow',
		'Blue',
	]);
	const [brands] = useState([
		'Apple',
		'Sumsung',
		'Microsoft',
		'Lenovo',
		'ASUS',
	]);
	const [color, setColor] = useState('');
	const [brand, setBrand] = useState('');
	const { user } = useSelector((state) => ({ ...state }));

	const loadCategories = () => {
		getCategories()
			.then((categories) => setCategories(categories.data))
			.catch((err) => {
				toast.error(err.message);
				throw new Error(err.message);
			});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('subCategory', subCategory);
		if (
			!title ||
			!description ||
			!price ||
			!category ||
			!shipping ||
			!quantity
		) {
			return;
		}
		const product = {
			title,
			description,
			price,
			category,
			subCategory,
			shipping,
			brand,
			color,
			quantity,
			images,
			postedBy: user._id,
		};
		await createProduct(product, user.token)
			.then((res) => {
				setTitle('');
				setDescription('');
				setPrice(0);
				setCategory('');
				setSubCategory('');
				setShipping('');
				setBrand('');
				setColor('');
				setQuantity(0);
				toast.success(`${res.data.title} is created successfully`);
				//navigate('/admin/products');
				window.location.reload();
			})
			.catch((err) => {
				toast.error(err.message);
				throw new Error(err.message);
			});
	};

	useEffect(() => {
		loadCategories();
	}, []);

	return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-md-2'>
					<AdminNav />
				</div>
				<div className='col-md-10'>
					<h4>Product Create</h4>
					<hr />
					<div className='p-3'>
						<FileUploadForm
							images={images}
							setImages={setImages}
							loading={loading}
							setLoading={setLoading}
							setIsChanged={() => {}}
						/>
					</div>
					<CreateProductForm
						handleSubmit={handleSubmit}
						title={title}
						setTitle={setTitle}
						description={description}
						setDescription={setDescription}
						price={price}
						setPrice={setPrice}
						category={category}
						categories={categories}
						setCategory={setCategory}
						setSubCategory={setSubCategory}
						quantity={quantity}
						setQuantity={setQuantity}
						shipping={shipping}
						setShipping={setShipping}
						color={color}
						setColor={setColor}
						colors={colors}
						brand={brand}
						setBrand={setBrand}
						brands={brands}
					/>
				</div>
			</div>
		</div>
	);
};

export default CreateProductPage;
