const express = require('express');
const authRoutes = require('./auth.controller');
const baseRoutes = require('./base.controller');
const chatRoutes = require('./chat.controller');

const router = express.Router();

router.use('/', baseRoutes);
router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);

module.exports = router;
