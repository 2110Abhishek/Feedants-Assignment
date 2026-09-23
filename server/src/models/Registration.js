const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'REGISTERED', 'CANCELLED'],
      default: 'REGISTERED',
    },
    entryFee: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['NOT_REQUIRED', 'PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PAID',
    },
    paymentReference: {
      type: String,
      default: () => `MOCK_PAY_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// CRITICAL UNIQUE COMPOUND INDEX (PRD Section 26)
// Guarantees that User A + Competition X can exist only once
registrationSchema.index({ competitionId: 1, userId: 1 }, { unique: true });
registrationSchema.index({ competitionId: 1, status: 1 });

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
