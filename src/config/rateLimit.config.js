const rateLimit = require('express-rate-limit');
const { message } = require('../constant/response');

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    limit: 10, // max: 10 request per minute
    message: 'Too many requests, please try again later.',
});

module.exports = limiter;
