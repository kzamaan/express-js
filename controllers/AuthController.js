// module scaffolding

const handler = {};

handler.loginView = (req, res) => {
	res.render('admin/login');
};

handler.login = (req, res) => {
	res.send('login');
};

module.exports = handler;
