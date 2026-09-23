const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feedants?directConnection=true',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secure-jwt-secret-feedants-2026-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || '*',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
