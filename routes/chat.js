const express = require('express');
const {
    getConversations,
    getMessages,
    sendMessage,
    findConversation,
    createConversation
} = require('@controllers/ChatController');

const { cookieAuth: auth } = require('@middleware/authenticate');

const router = express.Router();

router.get('/find-conversation/:userId', auth, findConversation);
router.post('/create-conversation', auth, createConversation);
router.post('/send-message', auth, sendMessage);
router.get('/get-conversations/:userId', auth, getConversations);
router.get('/get-messages/:conversationId', auth, getMessages);

module.exports = router;
