// dependency imports
const express = require('express');
const AuthController = require('@controllers/auth.controller');

const router = express.Router();
const User = require('@models/user.model');

router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);
router.post('/register', AuthController.register);

// routes
router.get('/users', (req, res) => {
	User.find({})
		.then((users) => {
			if (users.length > 0) {
				res.json({
					user_list: users,
					message: 'Success'
				});
			} else {
				res.status(204).json({
					message: 'User data not found!'
				});
			}
		})
		.catch((error) => {
			console.log(error);
		});
});

router.get('/user/:id', (req, res) => {
	console.log(req.params);
	res.json(req.params);
});

module.exports = router;
