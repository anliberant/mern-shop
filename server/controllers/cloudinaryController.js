import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

class CloudinaryController {
	constructor() {
		if (!CloudinaryController.instance) {
			CloudinaryController.instance = this;
		}
		return CloudinaryController.instance;
	}
	async uploadImg(req, res) {
		res.header('Access-Control-Allow-Origin', '*');
		const { image } = req.body;
		if (!image) {
			return res.status(400).json({ err: 'Image not found' });
		}
		try {
			const result = await cloudinary.uploader.upload(image, {
				public_id: `${Date.now()}`,
				resource_type: 'auto',
				overwrite: true,
			});
			res.status(200).json({
				public_id: result.public_id,
				url: result.secure_url,
			});
		} catch (err) {
			return res.status(400).json({ err: err.message });
		}
	}
	async removeImg(req, res) {
		let { imageId } = req.body;
		await cloudinary.uploader.destroy(imageId, (err, result) => {
			if (err) {
				return res.status(500).json({ err: 'Image not deleted' });
			}
			res.status(200).send('ok');
		});
	}
}
CloudinaryController.instance = undefined;
const cloudinaryController = new CloudinaryController();
Object.freeze(cloudinaryController);
export default cloudinaryController;
