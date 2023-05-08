const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Unauthorized = require('../utilities/Unauthorized');
const Unprocessable = require('../utilities/Unprocessable');

// module scaffolding
const handler = {};

handler.login = async (req, res, next) => {
    try {
        // find a user who has this email/username
        const { username, password } = req.body;
        const user = await User.findOne({
            $or: [{ email: username }, { username }]
        });

        if (user && user._id) {
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (isValidPassword) {
                // prepare the user object to generate token
                const userObject = {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    avatar: null
                };

                // generate token
                const accessToken = jwt.sign(userObject, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY
                });

                // set cookie
                res.cookie(process.env.COOKIE_NAME, accessToken, {
                    maxAge: process.env.JWT_EXPIRY,
                    httpOnly: !process.env.NODE_ENV === 'production',
                    secure: process.env.NODE_ENV === 'production',
                    signed: true,
                    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax'
                });

                res.status(200).json({
                    message: 'Login successful!',
                    success: true,
                    user: userObject,
                    token: accessToken
                });
            } else {
                throw new Unauthorized('Invalid credentials!');
            }
        } else {
            throw new Unauthorized('Invalid credentials!');
        }
    } catch (err) {
        return next(err, req, res);
    }
};

handler.register = async (req, res, next) => {
    const { name, email, password, withLogin } = req.body;
    if (!name || !email) {
        res.status(422).json({
            message: 'Name and email are required!'
        });
    } else {
        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            const encryptedPassword = await bcrypt.hash(password, 10);
            const userData = {
                name,
                email,
                password: encryptedPassword
            };
            try {
                const user = await User.create(userData);
                if (withLogin) {
                    const userObject = {
                        _id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        avatar: null
                    };

                    // generate token
                    const accessToken = jwt.sign(userObject, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRY
                    });

                    // set cookie
                    res.cookie(process.env.COOKIE_NAME, accessToken, {
                        maxAge: process.env.JWT_EXPIRY,
                        httpOnly: !process.env.NODE_ENV === 'production',
                        secure: process.env.NODE_ENV === 'production',
                        signed: true,
                        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax'
                    });

                    res.status(200).json({
                        message: 'Login successful!',
                        success: true,
                        user: userObject,
                        token: accessToken
                    });
                } else {
                    res.status(201).json({
                        data: user,
                        message: 'User created successfully!',
                        success: true
                    });
                }
            } catch (err) {
                return next(err, req, res);
            }
        } else {
            return next(new Unprocessable('User already exists!'), req, res);
        }
    }
};

// do logout
handler.logout = (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME);
    res.json({
        message: 'Logout successful!',
        success: true
    });
};

// get current user
handler.refreshToken = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Current user',
        user: req.authUser
    });
};

module.exports = handler;
