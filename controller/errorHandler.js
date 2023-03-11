// module scaffolding

const handler = {};

// 404 error handler
handler.notFoundErrorHandler = (req, res, next) => {
	next('URL not found');
};

// global error handler
handler.errorHandler = (err, req, res, next) => {
	console.error('Error Message', err?.message);
	if (res.headersSent) {
		next(err);
	} else if (err.message) {
		res.status(500).send(err.message);
	} else {
		res.status(500).send({ error: err });
	}
};

module.exports = handler;
