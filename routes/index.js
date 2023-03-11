// dependency imports
const express = require('express');
const {
	getVideoList,
	getQuizList,
	getAnswerList,
	getContactsList,
	testMethod
} = require('../controllers/home.controller');
const { tokenAuth } = require('../middleware/auth');

const router = express.Router();

// routes
router.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Welcome to the API'
	});
});

router.get('/test', testMethod);
router.get('/videos', tokenAuth, getVideoList);
router.get('/quiz', tokenAuth, getQuizList);
router.get('/answers', tokenAuth, getAnswerList);
router.get('/contacts', getContactsList);

module.exports = router;
