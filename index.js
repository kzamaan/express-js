require('module-alias/register');
require('dotenv').config();

const path = require('path');
const cors = require('cors');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');

const routes = require('./routes');
const { errorHandler, requestHandler } = require('./middleware/errorHandler');
const { socketConnection } = require('./controllers/socket.controller');
const { errorLogger, infoLogger, logger } = require('./utilities/logger');
const mongoose = require('./config/mongoose');

// init express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
// init mongoose
mongoose();
// request handler
app.use(infoLogger);
app.use(requestHandler);

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
app.set('trust proxy');

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// api routes
app.get('/', (req, res) => {
    logger.info(`Incoming IP: ${req.ip}`);
    res.send(`Hello World! From: ${req.ip}`);
});
app.use('/api', routes);

// initialize socket.io config for chat namespace
const chat = io.of('/chat');
chat.on('connection', socketConnection);

// error logger
app.use(errorLogger);
// error handler
app.use(errorHandler);

// start server
server.listen(process.env.PORT, () => {
    logger.info(`Server is running port on ${process.env.PORT} and env is ${process.env.NODE_ENV}`);
});
