/*
 * @Author: Kamruzzaman
 * @Date: 2023-02-10 15:08:31
 * @Last Modified by: Kamruzzaman
 * @Last Modified time: 2023-02-16 17:28:12
 */
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const router = require('./router');

const connectionStr = 'mongodb://localhost:27017/express';
mongoose.set('strictQuery', true);
mongoose
    .connect(connectionStr)
    .then(() => {
        console.log('connected');
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

// start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
