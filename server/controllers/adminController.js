import User from '../models/User.model.js';
import Order from '../models/Order.model.js';

class AdminController {
	constructor() {
		if (!AdminController.instance) {
			AdminController.instance = this;
		}
		return AdminController.instance;
	}
	async getAllOrders(req, res) {
		let orders = await Order.find({})
			.sort('-createdAt')
			.populate('products.product')
			.exec();

		res.status(200).json(orders);
	}
	async orderStatus(req, res) {
		const { orderId, orderStatus } = req.body;
		const updated = await Order.findByIdAndUpdate(
			orderId,
			{ orderStatus },
			{ new: true },
		).exec();

		res.status(200).json(updated);
	}
}
AdminController.instance = undefined;

const adminController = new AdminController();
Object.freeze(adminController);

export default adminController;
