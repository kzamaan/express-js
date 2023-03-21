// Description: Conversation controller
// import dependencies
const Conversation = require('@models/conversation.model');
const Message = require('@models/message.model');

// module scaffolding
const handler = {};

handler.sendMessage = async (req, res) => {
	const { userId, message, conversationId } = req.body;
	try {
		let conversation = null;
		// check if conversation already exists
		if (conversationId) {
			conversation = await Conversation.findOne({ _id: conversationId });
		} else {
			conversation = await Conversation.findOne({
				$or: [
					{ toUser: userId, fromUser: req.authUser._id },
					{ toUser: req.authUser._id, fromUser: userId }
				]
			});
		}

		// if not create new conversation
		if (!conversation) {
			const newConversation = new Conversation({
				toUser: userId,
				fromUser: req.authUser._id,
				lastMessage: message
			});
			conversation = await newConversation.save();
		}

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
