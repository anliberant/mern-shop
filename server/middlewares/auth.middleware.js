import { admin } from '../firebase/index.js';
import User from '../models/User.model.js';

const authCheck = async (req, res, next) => {
	try {
		const candidateFirebaseUser = await admin
			.auth()
			.verifyIdToken(req.headers.authtoken);
		if (!candidateFirebaseUser) {
			return res.status(401).json({ err: 'Invalid or expired token' });
		}
		req.user = candidateFirebaseUser;
		next();
	} catch (err) {
		console.log(err);
		res.status(401).json({ err: 'Invalid or expired token' });
	}
};

const adminCheck = async (req, res, next) => {
	const { email } = req.user;

	const adminCandidate = await User.findOne({ email: email }).exec();
	if (!adminCandidate) {
		res.status(403).json({ err: 'User not found, please try again' });
	} else {
		if (adminCandidate.role !== 'admin') {
			res.status(403).json({ err: 'Admin recourses are not allowed' });
		}
		next();
	}
};

export { authCheck, adminCheck };
