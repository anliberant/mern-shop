import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import { router as authRoutes } from './routes/auth.js';
import { router as categoryRoutes } from './routes/category.js';
import { router as subCategoryRoutes } from './routes/subCategory.js';
import { router as productRoutes } from './routes/product.js';
import { router as cloudinaryRoutes } from './routes/cloudinary.js';
import { router as userRoutes } from './routes/user.js';
import { router as couponRoutes } from './routes/coupon.js';
import { router as stripeRoutes } from './routes/stripe.js';
import { router as adminRoutes } from './routes/admin.js';

dotenv.config();

const MONGO_URL = process.env.MONGO_URI;

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use(cors());
app.use('/api', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', subCategoryRoutes);
app.use('/api', productRoutes);
app.use('/api', cloudinaryRoutes);
app.use('/api', userRoutes);
app.use('/api', couponRoutes);
app.use('/api', stripeRoutes);
app.use('/api', adminRoutes);

try {
	MONGO_URL &&
		mongoose.connect(MONGO_URL, {}, () => {
			console.log('Connected to MongoDB', MONGO_URL);
			app.listen(process.env.PORT, async () => {
				console.log('Express server listening on', process.env.PORT);
			});
		});
} catch (err) {
	console.log(err);
}
