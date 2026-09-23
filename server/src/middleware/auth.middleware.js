const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const { AppError } = require('../utils/errors');

/**
 * Middleware to enforce authentication
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Missing or malformed token.', 401, 'AUTHENTICATION_REQUIRED');
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, config.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError('Session expired. Please log in again.', 401, 'TOKEN_EXPIRED');
      }
      throw new AppError('Invalid authentication token.', 401, 'INVALID_TOKEN');
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      throw new AppError('User account not found or deactivated.', 401, 'USER_NOT_FOUND');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication: Populates req.user if a valid token is present, but doesn't block guests.
 * Essential for GET /competitions/:id to return user-specific registration state while allowing guests!
 */
const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const user = await User.findById(decoded.id);
      req.user = user || null;
    } catch {
      req.user = null;
    }
    next();
  } catch {
    req.user = null;
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuthenticate,
};
