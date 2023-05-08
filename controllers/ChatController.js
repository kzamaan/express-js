// import dependencies
const { Conversation, Message } = require('../models');

// module scaffolding
const handler = {};

// find existing conversation
handler.findConversation = async (req, res) => {
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
handler.createConversation = async (req, res) => {
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
handler.sendMessage = async (req, res) => {
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
handler.getConversations = async (req, res) => {
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
handler.getMessages = async (req, res) => {
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

module.exports = handler;
