import User from '../models/User.model.js';

class UsersController {
	constructor() {
		if (!UsersController.instance) {
			UsersController.instance = this;
		}
		return UsersController.instance;
	}
	async createOrUpdateUser(req, res, next) {
		const { name, picture, email } = req.user;
		const candidateUser = await User.findOneAndUpdate(
			{ email: email },
			{ name: email.split('@')[0], picture },
			{ new: true },
		);
		console.log('createOrUpdateUser', candidateUser);
		if (candidateUser) {
			res.json(candidateUser);
		} else {
			const newUser = new User({
				email,
				name: email.split('@')[0],
				picture,
			});
			await newUser.save();
			res.json(newUser);
		}
		next();
	}

	getCurrentUser(req, res, next) {
		const { email } = req.user;
		if (!email) {
			return;
		}
		User.findOne({ email: req.user.email }).exec((err, user) => {
			if (err) {
				throw new Error(err.message);
			}
			res.json(user);
			next();
		});
	}
}
UsersController.instance = undefined;
const usersController = new UsersController();
Object.freeze(usersController);
export default usersController;
