// module scaffolding
const handler = {};

handler.auth = (req, res, next) => {
	next();
};

module.exports = handler;
