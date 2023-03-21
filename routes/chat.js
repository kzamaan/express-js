const express = require('express');
const { getConversations, sendMessage } = require('@controllers/chat.controller');
const { cookieAuth: auth } = require('@middleware/authenticate');

const router = express.Router();

router.get('/get-conversations/:userId', auth, getConversations);
router.post('/send-message', auth, sendMessage);

module.exports = router;
