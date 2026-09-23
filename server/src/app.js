const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/env');
const errorHandler = require('./middleware/error.middleware');
const { generalLimiter } = require('./middleware/rateLimit.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const competitionRoutes = require('./routes/competition.routes');
const submissionRoutes = require('./routes/submission.routes');
const systemRoutes = require('./routes/system.routes');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Logging
if (config.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Global Rate Limiting
app.use('/api/', generalLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime(), timestamp: new Date() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/competitions', competitionRoutes);
app.use('/api/v1/submissions', submissionRoutes);
app.use('/api/v1/system', systemRoutes);

// Catch-all 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;
