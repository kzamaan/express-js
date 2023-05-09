const { createLogger, format, transports } = require('winston');
const expressWinston = require('express-winston');
require('winston-daily-rotate-file');
require('winston-mongodb');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const path = require('path');

const logFormat = format.printf(
    ({ level, message, timestamp, stack }) => `${timestamp}: ${level} - ${stack || message}`
);

const devLogger = createLogger({
    level: 'debug',
    format: format.combine(
        format.colorize({ colors: { info: 'blue', error: 'red', warn: 'yellow' } }),
        format.timestamp({ format: 'DD/MM/YYYY || HH:mm:ss' }),
        format.errors({ stack: true }),
        logFormat
    ),
    transports: [new transports.Console()]
});

const prodLogger = createLogger({
    level: 'debug',
    format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: 'error.log',
            level: 'error',
            dirname: path.resolve(__dirname, '..', '..', 'logs')
        }),
        new transports.File({
            filename: 'combined.log',
            level: 'debug',
            dirname: path.resolve(__dirname, '..', '..', 'logs')
        })
    ]
});

const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

const fileTransport = new transports.DailyRotateFile({
    filename: 'application-info-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    dirname: path.resolve(__dirname, '../logs')
});

const esTransportOpts = {
    level: 'info',
    clientOpts: { node: 'http://localhost:9200/' },
    indexPrefix: 'log-express'
};

const esTransport = new ElasticsearchTransport(esTransportOpts);

const fileErrorTransport = new transports.DailyRotateFile({
    filename: 'application-error-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    dirname: path.resolve(__dirname, '../logs')
});

const mongoErrorTransport = new transports.MongoDB({
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
    transports: [new transports.Console(), fileTransport, esTransport],
    format: format.combine(format.colorize(), format.json()),
    meta: false,
    msg: getLogMessage
});

const errorLogger = expressWinston.errorLogger({
    transports: [new transports.Console(), fileErrorTransport, mongoErrorTransport, esTransport],
    format: format.combine(format.colorize(), format.json()),
    meta: true,
    msg: '{ "correlationId": "{{req.headers["x-correlation-id"]}}", "error" : "{{err.message}}" }',
    correlationId: "{{req.headers['x-correlation-id']}}"
});

module.exports = {
    logger,
    infoLogger,
    errorLogger
};
