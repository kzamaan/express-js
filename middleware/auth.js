const jwt = require('jsonwebtoken');

// module scaffolding
const handler = {};

handler.cookieAuth = (req, res, next) => {
	const cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

	if (cookies) {
		try {
			const token = cookies[process.env.COOKIE_NAME];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.authUser = decoded;
			next();
		} catch (err) {
			res.status(500).json({
				success: false,
				message: 'Authentication failure!'
			});
		}
	} else {
		res.status(401).json({
			success: false,
			message: 'Authentication failure!'
		});
	}
};

handler.tokenAuth = (req, res, next) => {
	const bearerHeader = req.headers.authorization;
	if (bearerHeader) {
		const splitToken = bearerHeader.split(' ');
		try {
			const token = splitToken[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.authUser = decoded;
			next();
		} catch (err) {
			res.status(401).json({
				success: false,
				message: 'Authentication failure!'
			});
		}
	} else {
		res.status(401).json({
			success: false,
			message: 'Authentication failure!'
		});
	}
};

module.exports = handler;
