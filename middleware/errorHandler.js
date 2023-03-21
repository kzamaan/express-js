// module scaffolding
const handler = {};

// 404 error handler
handler.notFoundErrorHandler = (req, res, next) => {
	next('URL not found');
};

// global error handler
handler.errorHandler = (err, req, res, next) => {
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
			stack: err?.stack
		});
	}
};

module.exports = handler;
