const mongoose = require('mongoose');

const judgingParameterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    weight: { type: Number, required: true },
  },
  { _id: false }
);

const ruleSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String, required: true },
  },
  { _id: false }
);

const rewardSchema = new mongoose.Schema(
  {
    position: { type: Number, required: true },
    amount: { type: Number, required: true },
    title: { type: String }, // e.g. "1st Winner"
  },
  { _id: false }
);

const previousWinnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    videoUrl: { type: String },
  },
  { _id: false }
);

const competitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Competition title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      default: 'Dance',
    },
    mode: {
      type: String,
      enum: ['SINGLE_WIN', 'MULTI_WIN'],
      default: 'MULTI_WIN',
    },
    description: {
      type: String,
      required: true,
    },
    winnerCertificate: {
      type: Boolean,
      default: true,
    },
    prizePool: {
      type: Number,
      required: true,
      min: 0,
    },
    entryFee: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    registrationStartAt: {
      type: Date,
      required: true,
    },
    registrationEndAt: {
      type: Date,
      required: true,
    },
    submissionStartAt: {
      type: Date,
      required: true,
    },
    submissionEndAt: {
      type: Date,
      required: true,
    },
    resultDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'COMPLETED'],
      default: 'PUBLISHED',
      index: true,
    },
    judge: {
      name: { type: String, required: true },
      designation: { type: String, required: true },
      experienceYears: { type: Number, required: true },
      profileImageUrl: { type: String, required: true },
      introVideoUrl: { type: String },
    },
    judgingParameters: [judgingParameterSchema],
    rules: [ruleSchema],
    rewards: [rewardSchema],
    previousWinners: [previousWinnerSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for spots remaining (PRD Section 24: spotsRemaining = capacity - registeredCount)
competitionSchema.virtual('spotsRemaining').get(function () {
  return Math.max(0, this.capacity - (this.registeredCount || 0));
});

// Compound/single indexes for queries
competitionSchema.index({ registrationStartAt: 1, registrationEndAt: 1 });

const Competition = mongoose.model('Competition', competitionSchema);

module.exports = Competition;
