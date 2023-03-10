const path = require('path');
const dotEnv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const baseRoutes = require('./routes/index');
const userRoute = require('./routes/userRoute');
const { notFoundErrorHandler, errorHandler } = require('./controllers/ErrorHandler');

// init express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotEnv.config();

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// set database connection
const connectionStr = 'mongodb://localhost:27017/express_quiz';
mongoose.set('strictQuery', true);

try {
	mongoose.connect(connectionStr, { useNewUrlParser: true, useUnifiedTopology: true });
	console.log('Mongodb connected by mongoose');
} catch (err) {
	console.log(err);
}

// routes
app.use('/api', baseRoutes);
app.use('/api/auth', userRoute);

// url not found
app.use(notFoundErrorHandler);
// error handler
app.use(errorHandler);

// start server
app.listen(8000, () => {
	console.log('Server is running on http://localhost:8000');
});
