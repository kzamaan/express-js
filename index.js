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
const mongooseConnect = require('./config/mongoose');
const { NotFound } = require('./utilities/errors');

// init express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
// init mongoose
mongooseConnect();
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

// initialize socket.io config for chat namespace
const chat = io.of('/chat');
chat.on('connection', socketConnection);

// app routes
app.get('/', (req, res) => {
    logger.info(`Incoming IP: ${req.ip}`);
    res.send(`Hello World! From: ${req.ip}`);
});
// api routes
app.use('/api', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(new NotFound('URL Not Found'));
});

// error logger
app.use(errorLogger);
// error handler
app.use(errorHandler);

// start server
server.listen(process.env.PORT, () => {
    logger.info(`Server is running port on ${process.env.PORT} and env is ${process.env.NODE_ENV}`);
});
