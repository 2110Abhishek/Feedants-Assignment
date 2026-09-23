const app = require('./app');
const config = require('./config/env');
const { connectDB } = require('./config/database');

connectDB().then(() => {
  const server = app.listen(config.PORT, () => {
    console.log(`[Server] Feedants Modular Monolith Backend listening on port ${config.PORT} (MongoDB Atlas connected)`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[Server Error] Port ${config.PORT} is already in use by another process.`);
      console.error(`Please terminate any process on port ${config.PORT} or choose another port in .env.`);
    } else {
      console.error('[Server Error]:', err);
    }
    process.exit(1);
  });

  const shutdown = () => {
    console.log('[Server] Gracefully shutting down...');
    server.close(() => {
      console.log('[Server] Closed remaining connections.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
});
