const express = require('express');
const { getConversations, getMessages, sendMessage } = require('@controllers/chat.controller');
const { cookieAuth: auth } = require('@middleware/authenticate');

const router = express.Router();

router.post('/send-message', auth, sendMessage);
router.get('/get-conversations/:userId', auth, getConversations);
router.get('/get-messages/:conversationId', auth, getMessages);

module.exports = router;
