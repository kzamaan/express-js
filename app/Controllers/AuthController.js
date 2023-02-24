// module scaffolding

const auth = {};

auth.loginView = (req, res) => {
	res.render('admin/login');
};

auth.login = (req, res) => {
	res.send('login');
};

module.exports = auth;
