require('module-alias/register');
require('dotenv').config();

const path = require('path');
const cors = require('cors');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');

const winston = require('winston');
const expressWinston = require('express-winston');
const winstonDaily = require('winston-daily-rotate-file');
const winstonMongo = require('winston-mongodb');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const baseRoute = require('./routes');
const authRoute = require('./routes/auth');
const chatRoute = require('./routes/chat');
const { errorHandler, requestHandler } = require('./middleware/errorHandler');
const { socketConnection } = require('./controllers/SocketController');
const logger = require('./utilities/logger');
const mongoose = require('./config/mongoose');

// init express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
// init mongoose
mongoose();
// request handler
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

const fileTransport = new winston.transports.DailyRotateFile({
    filename: 'application-info-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    dirname: path.join(__dirname, 'logs')
});

const esTransportOpts = {
    level: 'info',
    clientOpts: { node: 'http://localhost:9200/' },
    indexPrefix: 'log-express'
};

const esTransport = new ElasticsearchTransport(esTransportOpts);

const fileErrorTransport = new winston.transports.DailyRotateFile({
    filename: 'application-error-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    dirname: path.join(__dirname, 'logs')
});

const mongoErrorTransport = new winston.transports.MongoDB({
    db: process.env.MONGO_URI,
    metaKey: 'meta',
    collection: 'logs'
});

const getLogMessage = (req, res) => {
    const msgObj = {
        correlationId: req.headers['x-correlation-id'],
        requestBody: req.body
    };

    return JSON.stringify(msgObj);
};

const infoLogger = expressWinston.logger({
    transports: [new winston.transports.Console(), fileTransport, esTransport],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    meta: false,
    msg: getLogMessage
});

const errorLogger = expressWinston.errorLogger({
    transports: [new winston.transports.Console(), fileErrorTransport, mongoErrorTransport, esTransport],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    meta: true,
    msg: '{ "correlationId": "{{req.headers["x-correlation-id"]}}", "error" : "{{err.message}}" }',
    correlationId: "{{req.headers['x-correlation-id']}}"
});

app.use(infoLogger);

// api routes
app.get('/', (req, res) => {
    logger.info(`Incoming IP: ${req.ip}`);
    res.send(`Hello World! From: ${req.ip}`);
});
app.use('/api', baseRoute);
app.use('/api/auth', authRoute);
app.use('/api/chat', chatRoute);

// initialize socket.io config for chat namespace
const chat = io.of('/chat');
chat.on('connection', socketConnection);

app.use(errorLogger);
// error handler
app.use(errorHandler);

// start server
server.listen(process.env.PORT, () => {
    logger.info(`Server is running port on ${process.env.PORT} and env is ${process.env.NODE_ENV}`);
});
