const express = require('express');
const authRoutes = require('../controllers/auth.controller');
const baseRoutes = require('../controllers/base.controller');
const chatRoutes = require('../controllers/chat.controller');

const router = express.Router();

router.use('/', baseRoutes);
router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);

module.exports = router;
