module.exports = {
    PORT: process.env.PORT || 8000,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    COOKIE_NAME: process.env.COOKIE_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    MONGO_HOST: process.env.MONGO_HOST || 'localhost',
    NODE_ENV: process.env.NODE_ENV || 'development'
};
