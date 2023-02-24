// dependency imports
const express = require('express');

const router = express.Router();
const { loginView, login } = require('../../app/Controllers/AuthController');

// routes
router.get('/login', loginView);
router.post('/login', login);

router.get('/', (req, res) => {
	res.render('admin/index');
});

module.exports = router;
