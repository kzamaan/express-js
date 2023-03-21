// Description: Conversation controller
// import dependencies
const Conversation = require('@models/conversation.model');
const Message = require('@models/message.model');

// module scaffolding
const handler = {};

handler.sendMessage = async (req, res) => {
	const { userId, message } = req.body;
	try {
		// check if conversation already exists
		let conversation = await Conversation.findOne({
			$or: [
				{ toUser: userId, fromUser: req.authUser._id },
				{ toUser: req.authUser._id, fromUser: userId }
			]
		});
		console.log(conversation);
		if (!conversation) {
			const newConversation = new Conversation({
				toUser: userId,
				fromUser: req.authUser._id,
				lastMessage: message
			});
			conversation = await newConversation.save();
		}
		// save message
		const newMessage = new Message({
			userId: req.authUser._id,
			conversationId: conversation._id,
			message
		});
		await newMessage.save();

		// if conversation exists, update last message
		if (conversation) {
			conversation.lastMessage = message;
			await conversation.save();
		}

		res.status(201).json({
			success: true,
			message: 'Message sent successfully',
			data: {
				conversationId: conversation._id,
				userId: req.authUser._id,
				message
			}
		});
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
			.exec();
		if (docs.length > 0) {
			res.status(200).json({
				success: true,
				message: 'Conversation fetched successfully',
				conversations: docs
			});
		} else {
			res.status(404).json({
				success: false,
				message: 'No conversation found',
				conversations: []
			});
		}
	} catch (error) {
		res.status(500).json({ error });
	}
};

module.exports = handler;
