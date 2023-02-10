// dependency imports
const express = require('express');

// routes object - module scaffolding
const router = express.Router();

// routes
router.get('/create', (req, res) => {
    console.log(req.body);
    res.send({ message: 'Hello World', ...req.body });
});

router.get('/user/:id', (req, res) => {
    console.log(req.params);
    res.send({ message: 'Hello World', ...req.params });
});

// url not found
router.all('*', (req, res) => {
    res.status(404).send({ message: 'URL not found' });
});

module.exports = router;
