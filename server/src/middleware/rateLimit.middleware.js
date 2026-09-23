const rateLimit = require('express-rate-limit');
const config = require('../config/env');

const isTest = config.NODE_ENV === 'test';

const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isTest ? 10000 : 100,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isTest ? 10000 : 15, // generous for dev/demo
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMITED',
      message: 'Too many authentication attempts, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
});

const registrationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isTest ? 10000 : 30,
  message: {
    success: false,
    error: {
      code: 'REGISTRATION_RATE_LIMITED',
      message: 'Too many registration attempts. Please wait a moment.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
});

module.exports = {
  generalLimiter,
  authLimiter,
  registrationLimiter,
};
