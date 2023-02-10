/*
 * @Author: Kamruzzaman
 * @Date: 2023-02-10 15:08:31
 * @Last Modified by: Kamruzzaman
 * @Last Modified time: 2023-02-10 19:04:01
 */

const express = require('express');
const router = require('./router');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

// start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
