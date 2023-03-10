const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// module scaffolding
const handler = {};

handler.login = async (req, res) => {
	try {
		// find a user who has this email/username
		const { username, password } = req.body;
		const user = await User.findOne({
			$or: [{ email: username }, { username }]
		});

		if (user && user._id) {
			const isValidPassword = await bcrypt.compare(password, user.password);

			if (isValidPassword) {
				// prepare the user object to generate token
				const userObject = {
					id: user._id,
					name: user.name,
					username: user.name,
					email: user.email,
					profile_photo_path: user.profile_photo_path || null,
					created_at: user.created_at,
					updated_at: user.updated_at
				};

				// generate token
				const accessToken = jwt.sign(userObject, process.env.JWT_SECRET, {
					expiresIn: process.env.JWT_EXPIRY
				});

				// set cookie
				res.cookie(process.env.COOKIE_NAME, accessToken, {
					maxAge: process.env.JWT_EXPIRY,
					httpOnly: true,
					signed: true
				});

				res.status(200).json({
					message: 'Login successful!',
					success: true,
					user: userObject,
					token: accessToken
				});
			} else {
				res.status(401).json({
					message: 'Invalid credentials!',
					success: false
				});
			}
		} else {
			res.status(401).json({
				message: 'Invalid credentials!',
				success: false
			});
		}
	} catch (err) {
		res.status(500).json({
			message: err.message,
			success: false
		});
	}
};

// do logout
handler.logout = (req, res) => {
	res.clearCookie(process.env.COOKIE_NAME);
	res.json({
		message: 'Logout successful!',
		success: true
	});
};

module.exports = handler;
