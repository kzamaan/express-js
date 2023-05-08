const multer = require('multer');
const { Video, Quiz, Answer, Contact, User } = require('../models');

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

handler.getUsersList = async (req, res) => {
    try {
        // add pagination
        //
        const docs = await User.find({ _id: { $ne: req.authUser._id } })
            .limit(100)
            .exec();

        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            users: docs
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err
        });
    }
};

handler.getVideoList = async (req, res) => {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    try {
        // add pagination
        const docs = await Video.find({}).skip(skip).limit(limit).exec();

        res.status(200).json({
            success: true,
            message: 'Videos fetched successfully',
            videos: docs,
            hasMore: docs.length === limit
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err
        });
    }
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

// upload based64 image by multer middleware
const storage = multer.memoryStorage();
// eslint-disable-next-line no-unused-vars
const upload = multer({ storage });

handler.uploadImage = (req, res) => {
    res.send('upload image');
};

module.exports = handler;
