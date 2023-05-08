const GeneralError = require('./GeneralError');

class BadRequest extends GeneralError {
    constructor(message) {
        super(message);
        this.name = 'BadRequest';
    }

    getCode() {
        return 400;
    }
}

module.exports = BadRequest;
