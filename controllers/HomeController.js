const Video = require('../models/Video');
const Quiz = require('../models/Quiz');
const Answer = require('../models/Answer');

// module scaffolding
const handler = {};

handler.testMethod = (req, res) => {
	const { videos, quiz, answers } = req.body;

	if (videos?.length > 0) {
		Video.insertMany(videos, (error, docs) => {
			if (error) {
				res.status(500).json({
					success: false,
					message: 'Internal server error',
					error
				});
			} else {
				res.status(200).json({
					success: true,
					message: `${docs.length} Videos inserted successfully`,
					docs
				});
			}
		});
	} else if (quiz?.length > 0) {
		Quiz.insertMany(quiz, (error, docs) => {
			if (error) {
				res.status(500).json({
					success: false,
					message: 'Internal server error',
					error
				});
			} else {
				res.status(200).json({
					success: true,
					message: `${docs.length} Quiz inserted successfully`,
					docs
				});
			}
		});
	} else if (answers?.length > 0) {
		Answer.insertMany(answers, (error, docs) => {
			if (error) {
				res.status(500).json({
					success: false,
					message: 'Internal server error',
					error
				});
			} else {
				res.status(200).json({
					success: true,
					message: `${docs.length} Answers inserted successfully`,
					docs
				});
			}
		});
	} else {
		res.status(400).json({
			success: false,
			message: 'Bad request'
		});
	}
};

handler.getVideoList = (req, res) => {
	Video.find({}, (error, videos) => {
		if (error) {
			res.status(500).json({
				success: false,
				message: 'Internal server error',
				error
			});
		} else {
			res.status(200).json({
				success: true,
				message: 'Videos fetched successfully',
				videos
			});
		}
	});
};

handler.getQuizList = (req, res) => {
	Quiz.find({}, (error, quizzes) => {
		if (error) {
			res.status(500).json({
				success: false,
				message: 'Internal server error',
				error
			});
		} else {
			res.status(200).json({
				success: true,
				message: 'Quiz fetched successfully',
				quizzes
			});
		}
	});
};

handler.getAnswerList = (req, res) => {
	Answer.find({}, (error, answers) => {
		if (error) {
			res.status(500).json({
				success: false,
				message: 'Internal server error',
				error
			});
		} else {
			res.status(200).json({
				success: true,
				message: 'Answers fetched successfully',
				answers
			});
		}
	});
};

module.exports = handler;
