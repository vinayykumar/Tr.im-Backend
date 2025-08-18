const rateLimit = require("express-rate-limit");

// Global limiter (all requests)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // each IP can make 100 requests per 15min
    message: { error: "Too many requests, please try again later." }
});

// Specific limiter for URL shortening
const shortenLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // max 5 shorten requests per minute
    message: { error: "Too many URL shorten requests, slow down!" }
});

module.exports = {
    globalLimiter,
    shortenLimiter
}