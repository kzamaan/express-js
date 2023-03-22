// module scaffolding
const handler = {};

// 404 error handler
handler.notFoundErrorHandler = (req, res, next) => {
	next({ message: 'URL not found' });
};

// global error handler
handler.lastErrorHandler = (err, req, res, next) => {
	if (res.headersSent) {
		next(err);
	} else if (err.message) {
		res.status(500).json({
			success: false,
			message: err.message
		});
	} else {
		res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: err
		});
	}
};

module.exports = handler;
