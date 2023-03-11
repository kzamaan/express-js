// dependency imports
const express = require('express');
const {
	getVideoList,
	getQuizList,
	getAnswerList,
	getContactsList,
	testMethod
} = require('../controllers/HomeController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// routes
router.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Welcome to the API'
	});
});

router.get('/test', testMethod);
router.get('/videos', auth, getVideoList);
router.get('/quiz', auth, getQuizList);
router.get('/answers', auth, getAnswerList);
router.get('/contacts', getContactsList);

module.exports = router;
