const GeneralError = require('./GeneralError');

class Unauthorized extends GeneralError {
    constructor(message) {
        super(message);
        this.name = 'Unauthorized';
    }

    getCode() {
        return 401;
    }
}

module.exports = Unauthorized;
