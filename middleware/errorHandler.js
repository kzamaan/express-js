const GeneralError = require('../utilities/GeneralError');

// module scaffolding
const handler = {};

// 404 error handler
handler.requestHandler = (req, res, next) => {
    let correlationId = req.headers['x-correlation-id'];
    if (!correlationId) {
        correlationId = Date.now().toString();
        req.headers['x-correlation-id'] = correlationId;
    }

    res.set('x-correlation-id', correlationId);
    next();
};

// global error handler
// eslint-disable-next-line no-unused-vars
handler.errorHandler = (err, req, res, next) => {
    const correlationId = req.headers['x-correlation-id'];
    let code = 500;
    if (err instanceof GeneralError) {
        code = err.getCode();
    }
    return res.status(code).json({
        correlationId,
        message: err.message
    });
};

module.exports = handler;
