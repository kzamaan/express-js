const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('@models/user.model');

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
					_id: user._id,
					name: user.name,
					username: user.username,
					email: user.email,
					avatar: null
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

handler.register = async (req, res) => {
	const { name, email, password, withLogin } = req.body;
	if (!name || !email) {
		res.status(422).json({
			error: 'Data validation error'
		});
	} else {
		const checkUser = await User.findOne({ email });
		if (checkUser) {
			res.status(422).json({
				message: 'User already exists.',
				success: false
			});
		}
		const encryptedPassword = await bcrypt.hash(password, 10);
		const userData = {
			name,
			email,
			password: encryptedPassword
		};
		try {
			const user = await User.create(userData);
			if (withLogin) {
				const userObject = {
					id: user._id,
					name: user.name,
					username: user.username,
					email: user.email,
					profile_photo_path: user.profile_photo_path,
					created_at: user.created_at
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
			}
			res.status(201).json({
				data: user,
				message: 'User created successfully!',
				success: true
			});
		} catch (error) {
			console.log(error);
		}
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

// get current user
handler.refreshToken = (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Current user',
		user: req.authUser
	});
};

module.exports = handler;
