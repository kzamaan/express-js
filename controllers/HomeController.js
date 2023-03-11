const Video = require('../models/Video');
const Quiz = require('../models/Quiz');
const Answer = require('../models/Answer');
const Contact = require('../models/Contact');

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
	Video.find({}, (error, docs) => {
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
				videos: docs
			});
		}
	});
};

handler.getQuizList = (req, res) => {
	Quiz.find({}, (error, docs) => {
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
				quizzes: docs
			});
		}
	});
};

handler.getAnswerList = (req, res) => {
	Answer.find({}, (error, docs) => {
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
				answers: docs
			});
		}
	});
};

handler.getContactsList = async (req, res) => {
	try {
		const docs = await Contact.find({}).limit(500).exec();
		res.status(200).json({
			success: true,
			message: `${docs.length} Contacts fetched successfully`,
			contacts: docs
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Internal server error',
			error
		});
	}
};

module.exports = handler;
