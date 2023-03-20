const express = require('express');

const router = express.Router();

// routes
router.get('/:room', (req, res) => {
	res.send({ roomId: req.params.room });
});

module.exports = router;
