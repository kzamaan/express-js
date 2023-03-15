// dependency imports
const express = require('express');
const { cookieAuth: auth } = require('@middleware/authenticate');
const HomeController = require('@controllers/home.controller');
const AuthController = require('@controllers/auth.controller');

const router = express.Router();

// routes
router.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Welcome to the API'
	});
});

router.get('/test', HomeController.testMethod);
router.get('/current-user', auth, AuthController.getCurrentUser);
router.get('/videos', auth, HomeController.getVideoList);
router.get('/quiz', auth, HomeController.getQuizList);
router.get('/answers', auth, HomeController.getAnswerList);
router.get('/contacts', HomeController.getContactsList);

module.exports = router;
