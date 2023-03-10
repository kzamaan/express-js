// dependency imports
const express = require('express');
const { getVideoList, getQuizList, getAnswerList } = require('../controllers/HomeController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// routes
router.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Welcome to the API'
	});
});

router.get('/videos', auth, getVideoList);
router.get('/quiz', auth, getQuizList);
router.get('/answers', auth, getAnswerList);

module.exports = router;
