import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import FileUploadForm from '../../components/forms/FileUploadForm';
import UpdateProductForm from '../../components/forms/UpdateProductForm';
import AdminNav from '../../components/nav/AdminNav';
import { getCategories } from '../../controllers/category';
import {
	getProductBySlug,
	updateProductBySlug,
} from '../../controllers/product';

const UpdateProductPage = () => {
	const { slug } = useParams();

	const [loading, setLoading] = useState(false);
	const [isChanged, setIsChanged] = useState(false);
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		await updateProductBySlug(slug, user.token, {
			title,
			description,
			price,
			category,
			sub: subCategory,
			quantity,
			shipping,
			images,
			color,
			brand,
		})
			.then(() => {
				setLoading(false);
				toast.success('Product was successfully updated');
				window.location.reload();
			})
			.catch((err) => {
				setLoading(false);
				toast.error(err.message);
				throw err;
			});
	};

	const loadCategories = () => {
		getCategories()
			.then((categories) => setCategories(categories.data))
			.catch((err) => {
				throw new Error(err.message);
			});
	};

	useEffect(() => {
		loadCategories();
	}, []);
	useEffect(() => {
		(async () => {
			await getProductBySlug(slug).then((res) => {
				setTitle(res.data.product.title);
				setDescription(res.data.product.description);
				setPrice(res.data.product.price);
				setCategory(res.data.product.category._id);
				res.data.product.sub &&
					setSubCategory(res.data.product.sub._id);
				setQuantity(res.data.product.quantity);
				setShipping(res.data.product.shipping);
				setImages(res.data.product.images);
				setColor(res.data.product.color);
				setBrand(res.data.product.brand);
			});
		})();
	}, [slug]);
	return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-md-2'>
					<AdminNav />
				</div>
				<div className='col-md-10'>
					<h4>Product Update</h4>
					<hr />
					<div className='p-3'>
						<FileUploadForm
							images={images}
							setImages={setImages}
							loading={loading}
							setLoading={setLoading}
							setIsChanged={setIsChanged}
						/>
					</div>
					<UpdateProductForm
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
						subCategory={subCategory}
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
						isChanged={isChanged}
						setIsChanged={setIsChanged}
					/>
				</div>
			</div>
		</div>
	);
};
export default UpdateProductPage;
