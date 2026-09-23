const mongoose = require('mongoose');
const config = require('./env');

let hasTransactions = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);

    // Check if replica set is active or needs initiation
    try {
      const admin = conn.connection.db.admin();
      const status = await admin.command({ replSetGetStatus: 1 }).catch(async (err) => {
        if (err.codeName === 'NotYetInitialized' || err.message.includes('no replset config has been received')) {
          console.log('[MongoDB] Initializing single-node replica set rs0...');
          await admin.command({ replSetInitiate: {} });
          console.log('[MongoDB] Replica set rs0 initiated successfully!');
          return { ok: 1 };
        }
        throw err;
      });
      hasTransactions = true;
      console.log('[MongoDB] Multi-document transactions enabled.');
    } catch (rsErr) {
      console.log('[MongoDB] Standalone or replica set check:', rsErr.message);
      // Even if replica set isn't enabled, atomic MongoDB updates (findOneAndUpdate with $inc and $lt) guarantee capacity reservation
      hasTransactions = false;
    }

    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

const getTransactionSupport = () => hasTransactions;

module.exports = {
  connectDB,
  getTransactionSupport,
};
