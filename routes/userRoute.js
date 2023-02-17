// dependency imports
const express = require('express');
// const bcrypt = require('bcrypt');

const router = express.Router();
const User = require('../app/Models/User');

// routes
router.get('/users', (req, res) => {
    User.find({})
        .then((users) => {
            if (users.length > 0) {
                res.json({
                    user_list: users,
                    message: 'Success',
                });
            } else {
                res.status(204).json({
                    message: 'User data not found!',
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
});

router.get('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email) {
        res.status(422).json({
            error: 'Data validation error',
        });
    } else {
        const user = {
            name,
            email,
            password,
        };
        try {
            await User.create(user);
            res.json({
                message: 'User was successfully created.',
            });
        } catch (error) {
            console.log(error);
        }
    }
});

router.get('/user/:id', (req, res) => {
    console.log(req.params);
    res.json(req.params);
});

module.exports = router;
