const mongoose = require('mongoose');
const logger = require('@utilities/logger');

module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        logger.info('MongoDB connected');
    } catch (err) {
        logger.error(err);
    }
};
