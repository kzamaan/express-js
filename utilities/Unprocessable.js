const GeneralError = require('./GeneralError');

class Unprocessable extends GeneralError {
    constructor(message) {
        super(message);
        this.name = 'Unprocessable ';
    }

    getCode() {
        return 422;
    }
}

module.exports = Unprocessable;
