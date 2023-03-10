// dependency imports
const express = require('express');
const { getVideoList, getQuizList, getAnswerList } = require('../controllers/HomeController');

const router = express.Router();

// routes
router.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Welcome to the API'
	});
});

router.get('/videos', getVideoList);
router.get('/quiz', getQuizList);
router.get('/answers', getAnswerList);

module.exports = router;
