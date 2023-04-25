const { createLogger, format, transports } = require('winston');
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

module.exports = logger;
