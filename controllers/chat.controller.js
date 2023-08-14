// import dependencies
const express = require('express');
const { Conversation, Message, User } = require('../models');
const { cookieAuth: auth } = require('../middleware/authenticate');

const router = express.Router();

// find existing conversation
const findConversation = async (req, res) => {
    const { userId } = req.params;
    try {
        const conversation = await Conversation.findOne({
            $or: [
                { toUser: userId, fromUser: req.authUser._id },
                { toUser: req.authUser._id, fromUser: userId }
            ]
        });
        if (conversation) {
            res.status(200).json({
                success: true,
                conversation
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No conversation found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error
        });
    }
};

// if not create new conversation
const createConversation = async (req, res) => {
    const { userId, message } = req.body;
    try {
        const existsConversation = await Conversation.findOne({
            $or: [
                { toUser: userId, fromUser: req.authUser._id },
                { toUser: req.authUser._id, fromUser: userId }
            ]
        });

        if (!existsConversation) {
            const newConversation = new Conversation({
                toUser: userId,
                fromUser: req.authUser._id
            });
            const savedConversation = await newConversation.save();

            if (savedConversation) {
                // save message
                const newMessage = new Message({
                    userInfo: req.authUser._id,
                    conversationId: savedConversation._id,
                    message
                });
                await newMessage.save();

                // if conversation update last message
                savedConversation.lastMessage = message;
                await savedConversation.save();

                // populate conversation toUser and fromUser
                const populatedData = await Conversation.findOne({ _id: savedConversation._id })
                    .populate('toUser', 'name avatar')
                    .populate('fromUser', 'name avatar')
                    .exec();

                // target conversation to user
                const targetUser =
                    populatedData.toUser._id.toString() === req.authUser._id.toString()
                        ? populatedData.fromUser._id
                        : populatedData.toUser._id;

                global.io.emit(`conversation.${targetUser}`, populatedData);

                res.status(201).json({
                    success: true,
                    conversation: populatedData
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Something went wrong'
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'Conversation already exists'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error
        });
    }
};

// send message
const sendMessage = async (req, res) => {
    const { message, conversationId } = req.body;
    try {
        const conversation = await Conversation.findOne({ _id: conversationId })
            .populate('toUser', 'name avatar')
            .populate('fromUser', 'name avatar')
            .exec();

        if (conversation) {
            // save message
            const newMessage = new Message({
                userInfo: req.authUser._id,
                conversationId: conversation._id,
                message
            });

            await newMessage.save();

            // if conversation update last message
            conversation.lastMessage = message;
            await conversation.save();

            const targetUser =
                conversation.toUser._id.toString() === req.authUser._id.toString()
                    ? conversation.fromUser._id
                    : conversation.toUser._id;

            global.io.emit(`conversation.${targetUser}`, conversation);

            global.io.emit(`newMessage.${conversationId}`, {
                ...newMessage._doc,
                targetUser,
                userInfo: {
                    _id: req.authUser._id,
                    name: req.authUser.name,
                    avatar: req.authUser.avatar
                }
            });

            res.status(201).json({
                success: true,
                message: newMessage
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Something went wrong'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error
        });
    }
};

// get conversations
const getConversations = async (req, res) => {
    const { userId } = req.params;
    try {
        const docs = await Conversation.find({ $or: [{ toUser: userId }, { fromUser: userId }] })
            .populate('toUser', 'name avatar')
            .populate('fromUser', 'name avatar')
            .sort('-updatedAt')
            .exec();
        res.status(200).json({
            success: true,
            conversations: docs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error
        });
    }
};

// get messages
const getMessages = async (req, res) => {
    const { conversationId } = req.params;

    try {
        // find conversation
        const conversation = await Conversation.findOne({ _id: conversationId })
            .populate('toUser', 'name avatar')
            .populate('fromUser', 'name avatar')
            .exec();

        let chatHead = {};
        if (conversation?.toUser?._id.toString() === req.authUser._id.toString()) {
            chatHead = conversation?.fromUser;
        } else {
            chatHead = conversation?.toUser;
        }

        // find all messages
        const messages = await Message.find({ conversationId }).populate('userInfo', 'name avatar').exec();
        res.status(200).json({
            success: true,
            messages,
            chatHead
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error
        });
    }
};

// get users to start conversation
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.authUser._id } });

        // get all conversations
        const conversations = await Conversation.find({
            $or: [{ toUser: req.authUser._id }, { fromUser: req.authUser._id }]
        });
        // filter users who have conversation with current user
        const filteredUsers = users.map((user) => {
            const found = conversations.find((item) => {
                const { toUser, fromUser } = item;
                return toUser.toString() === user._id.toString() || fromUser.toString() === user._id.toString();
            });
            return {
                ...user._doc,
                conversationId: found ? found._id : null
            };
        });

        res.status(200).json({
            success: true,
            users: filteredUsers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error
        });
    }
};

router.get('/conversation/:userId', auth, findConversation);
router.get('/conversations/:userId', auth, getConversations);
router.post('/conversation', auth, createConversation);
router.get('/messages/:conversationId', auth, getMessages);
router.post('/message', auth, sendMessage);
router.get('/users', auth, getUsers);

module.exports = router;
