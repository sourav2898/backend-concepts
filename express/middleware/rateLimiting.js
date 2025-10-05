const { rateLimit } = require("express-rate-limit");

const createRateLimiter = (maxRequests, time) => {
  return rateLimit({
    max: maxRequests,
    windowMs: time,
    message: "Too many api requests, please try again in 30 secs",
    standardHeaders: true,
    legacyHeaders: false,
  });
};

module.exports = { createRateLimiter };
