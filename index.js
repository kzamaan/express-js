const path = require('path');
const cors = require('cors');
const dotEnv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const baseRoutes = require('./routes/index');
const userRoute = require('./routes/auth');
const { notFoundErrorHandler, errorHandler } = require('./middleware/errorHandler');

// init express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotEnv.config();

// set cors
app.use(cors({ credentials: true, origin: true }));

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// set database connection
(async () => {
	const connectionStr = process.env.MONGO_URI;
	mongoose.set('strictQuery', true);
	try {
		await mongoose.connect(connectionStr, { useNewUrlParser: true });
		console.log('MongoDB connected');
	} catch (err) {
		console.log(err);
	}
})();

// routes
app.use('/api', baseRoutes);
app.use('/api/auth', userRoute);

// url not found
app.use(notFoundErrorHandler);
// error handler
app.use(errorHandler);

// start server
app.listen(process.env.PORT, () => {
	console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
