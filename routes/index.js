// dependency imports
const express = require('express');
const { tokenAuth } = require('@middleware/auth');
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
router.get('/current-user', tokenAuth, AuthController.getCurrentUser);
router.get('/videos', tokenAuth, HomeController.getVideoList);
router.get('/quiz', tokenAuth, HomeController.getQuizList);
router.get('/answers', tokenAuth, HomeController.getAnswerList);
router.get('/contacts', HomeController.getContactsList);

module.exports = router;
