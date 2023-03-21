// Description: Conversation controller
// import dependencies
const Conversation = require('@models/conversation.model');
const Message = require('@models/message.model');

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
		const conversation = await Conversation.findOne({
			$or: [
				{ toUser: userId, fromUser: req.authUser._id },
				{ toUser: req.authUser._id, fromUser: userId }
			]
		});
		if (!conversation) {
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

				res.status(201).json({
					success: true,
					conversation: savedConversation,
					message: newMessage
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
		const conversation = await Conversation.findOne({ _id: conversationId });

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
		if (docs.length > 0) {
			res.status(200).json({
				success: true,
				conversations: docs
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
		if (messages.length > 0) {
			res.status(200).json({
				success: true,
				messages,
				chatHead
			});
		} else {
			res.status(404).json({
				success: false,
				message: 'No message found'
			});
		}
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
