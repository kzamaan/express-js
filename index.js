require('module-alias/register');
require('dotenv').config();

const path = require('path');
const cors = require('cors');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');

const baseRoute = require('@routes/index');
const authRoute = require('@routes/auth');
const chatRoute = require('@routes/chat');
const { notFoundErrorHandler, lastErrorHandler } = require('@middleware/errorHandler');
const { socketConnection } = require('@controllers/socket.controller');

// init express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);

// add socket.io
const io = socketIo(server, {
	cors: {
		origin: '*', // process.env.CLIENT_URL,
		methods: ['GET', 'POST']
	}
});

global.io = io;

// set cors
app.use(cors({ credentials: true, origin: true }));

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// set database connection
require('@config/mongoose');

// api routes
app.get('/', (req, res) => {
	res.send('Hello World!');
});
app.use('/api', baseRoute);
app.use('/api/auth', authRoute);
app.use('/api/chat', chatRoute);

// initialize socket.io config for chat namespace
const chat = io.of('/chat');
chat.on('connection', socketConnection);

// url not found
app.use(notFoundErrorHandler);
// error handler
app.use(lastErrorHandler);

// start server
server.listen(process.env.PORT, () => {
	console.log(
		`Server is running on http://localhost:${process.env.PORT} and application mode is ${process.env.NODE_ENV}`
	);
});
