const mongoose = require('mongoose');
const logger = require('@utilities/logger');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
        logger.info('MongoDB connected');
    } catch (err) {
        logger.error(err);
    }
})();
