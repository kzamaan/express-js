/*
 * @Author: Kamruzzaman
 * @Date: 2023-02-10 15:08:31
 * @Last Modified by: Kamruzzaman
 * @Last Modified time: 2023-02-24 12:11:44
 */
const path = require('path');
const dotEnv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute');
const adminRoutes = require('./routes/admin/index');
const baseRoutes = require('./routes/index');

// init express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotEnv.config();

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// set template engine
app.set('view engine', 'ejs');

// set database connection
const connectionStr = 'mongodb://localhost:27017/express';
mongoose.set('strictQuery', true);
try {
	mongoose.connect(connectionStr, { useNewUrlParser: true, useUnifiedTopology: true });
	console.log('Mongodb connected by mongoose');
} catch (err) {
	console.log(err);
}

// routes
app.use('/', baseRoutes);
app.use('/auth', userRoute);
app.use('/admin', adminRoutes);

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
	console.log('Server is running on http://localhost:3000');
});
