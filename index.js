/*
 * @Author: Kamruzzaman
 * @Date: 2023-02-10 15:08:31
 * @Last Modified by: Kamruzzaman
 * @Last Modified time: 2023-02-17 19:34:30
 */
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoute = require('./routes/userRoute');

const connectionStr = 'mongodb://localhost:27017/express';
mongoose.set('strictQuery', true);
mongoose
    .connect(connectionStr)
    .then(() => {
        console.log('Mongodb connected by mongoose');
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', userRoute);

// url not found
app.use((req, res, next) => {
    next('URL not found');
});

// error handler
app.use((err, req, res, next) => {
    console.log(err);
    if (res.headersSent) {
        next(err);
    } else if (err.message) {
        res.status(500).send(err.message);
    } else {
        res.status(500).send({ error: err });
    }
});
// start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
