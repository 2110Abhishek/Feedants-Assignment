const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
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
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Submission title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    mediaUrl: {
      type: String,
      required: [true, 'Submission media URL is required'],
    },
    thumbnailUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=400&q=80',
    },
    status: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'EVALUATED'],
      default: 'SUBMITTED',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ competitionId: 1, userId: 1 });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
