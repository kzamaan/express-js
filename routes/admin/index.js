// dependency imports
const express = require('express');

const router = express.Router();

// routes
router.get('/', (req, res) => {
	res.render('admin/index');
});

module.exports = router;
