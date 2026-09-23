const config = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_ERROR';
  let message = err.message || 'Internal server error';
  let details = err.details || null;

  // Handle Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_RESOURCE';
    const field = Object.keys(err.keyPattern || {})[0] || 'resource';
    if (err.keyPattern && err.keyPattern.competitionId && err.keyPattern.userId) {
      code = 'ALREADY_REGISTERED';
      message = 'You are already registered for this competition.';
    } else {
      message = `A record with this ${field} already exists.`;
    }
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_ID';
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (statusCode === 500 && config.NODE_ENV !== 'test') {
    console.error('[Unhandled Server Error]:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
      ...(config.NODE_ENV === 'development' && statusCode === 500 ? { stack: err.stack } : {}),
    },
  });
};

module.exports = errorHandler;
