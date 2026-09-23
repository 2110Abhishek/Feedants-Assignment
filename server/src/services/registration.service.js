const mongoose = require('mongoose');
const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const { AppError } = require('../utils/errors');
const { getTransactionSupport } = require('../config/database');

/**
 * Atomic registration service preventing race conditions and double bookings.
 */
const registerUserForCompetition = async (competitionId, user, options = {}) => {
  if (!user || !user._id) {
    throw new AppError('Authentication required to register', 401, 'AUTHENTICATION_REQUIRED');
  }

  const now = new Date();
  const hasTransactions = getTransactionSupport();

  // Fast-path duplicate check
  const existingRegistration = await Registration.findOne({
    competitionId,
    userId: user._id,
  });

  if (existingRegistration) {
    throw new AppError('You are already registered for this competition.', 409, 'ALREADY_REGISTERED');
  }

  // If transactions are enabled, run inside a MongoDB transaction session
  if (hasTransactions) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Re-verify duplicate inside session
      const existingInSession = await Registration.findOne({
        competitionId,
        userId: user._id,
      }).session(session);

      if (existingInSession) {
        throw new AppError('You are already registered for this competition.', 409, 'ALREADY_REGISTERED');
      }

      // Atomic reservation with concurrency & lifecycle guard
      const competition = await Competition.findOneAndUpdate(
        {
          _id: competitionId,
          status: 'PUBLISHED',
          registrationStartAt: { $lte: now },
          registrationEndAt: { $gt: now },
          $expr: {
            $lt: ['$registeredCount', '$capacity'],
          },
        },
        {
          $inc: { registeredCount: 1 },
        },
        {
          new: true,
          session,
        }
      );

      // If atomic update returned null, diagnose exact condition
      if (!competition) {
        await diagnoseRegistrationFailure(competitionId, now, session);
      }

      // Create Registration record inside transaction
      const [registration] = await Registration.create(
        [
          {
            competitionId: competition._id,
            userId: user._id,
            status: 'REGISTERED',
            entryFee: competition.entryFee, // Always derived from DB, never client
            paymentStatus: 'PAID', // Mocked payment
            paymentReference: `MOCK_TXN_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
            registeredAt: now,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return {
        registrationId: registration._id,
        competitionId: competition._id,
        status: registration.status,
        entryFee: registration.entryFee,
        spotsRemaining: Math.max(0, competition.capacity - competition.registeredCount),
        registeredCount: competition.registeredCount,
        registeredAt: registration.registeredAt,
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();

      if (err.code === 11000) {
        throw new AppError('You are already registered for this competition.', 409, 'ALREADY_REGISTERED');
      }
      throw err;
    }
  }

  // Fallback for non-replica standalone mode:
  // MongoDB atomic findOneAndUpdate is still atomic on single documents!
  const competition = await Competition.findOneAndUpdate(
    {
      _id: competitionId,
      status: 'PUBLISHED',
      registrationStartAt: { $lte: now },
      registrationEndAt: { $gt: now },
      $expr: {
        $lt: ['$registeredCount', '$capacity'],
      },
    },
    {
      $inc: { registeredCount: 1 },
    },
    { new: true }
  );

  if (!competition) {
    await diagnoseRegistrationFailure(competitionId, now);
  }

  try {
    const registration = await Registration.create({
      competitionId: competition._id,
      userId: user._id,
      status: 'REGISTERED',
      entryFee: competition.entryFee,
      paymentStatus: 'PAID',
      paymentReference: `MOCK_TXN_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      registeredAt: now,
    });

    return {
      registrationId: registration._id,
      competitionId: competition._id,
      status: registration.status,
      entryFee: registration.entryFee,
      spotsRemaining: Math.max(0, competition.capacity - competition.registeredCount),
      registeredCount: competition.registeredCount,
      registeredAt: registration.registeredAt,
    };
  } catch (err) {
    // If registration document creation failed due to duplicate key, rollback the atomic increment
    await Competition.findByIdAndUpdate(competitionId, {
      $inc: { registeredCount: -1 },
    });

    if (err.code === 11000) {
      throw new AppError('You are already registered for this competition.', 409, 'ALREADY_REGISTERED');
    }
    throw err;
  }
};

/**
 * Diagnoses why atomic findOneAndUpdate failed to provide exact PRD error codes.
 */
const diagnoseRegistrationFailure = async (competitionId, now, session = null) => {
  const query = Competition.findById(competitionId);
  if (session) query.session(session);
  const comp = await query;

  if (!comp || comp.status === 'DRAFT') {
    throw new AppError('Competition not found.', 404, 'COMPETITION_NOT_FOUND');
  }

  if (comp.status === 'COMPLETED') {
    throw new AppError('This competition has already completed.', 400, 'COMPETITION_COMPLETED');
  }

  if (now < comp.registrationStartAt) {
    throw new AppError('Registration for this competition has not started yet.', 400, 'REGISTRATION_NOT_STARTED');
  }

  if (now >= comp.registrationEndAt) {
    throw new AppError('Registration for this competition has closed.', 400, 'REGISTRATION_CLOSED');
  }

  if (comp.registeredCount >= comp.capacity) {
    throw new AppError('This competition is currently full. No spots remaining.', 409, 'COMPETITION_FULL');
  }

  throw new AppError('Registration is not currently available for this competition.', 400, 'REGISTRATION_UNAVAILABLE');
};

const getUserRegistration = async (competitionId, userId) => {
  const registration = await Registration.findOne({
    competitionId,
    userId,
  });

  if (!registration) {
    return null;
  }

  return {
    id: registration._id,
    competitionId: registration.competitionId,
    status: registration.status,
    entryFee: registration.entryFee,
    paymentStatus: registration.paymentStatus,
    paymentReference: registration.paymentReference,
    registeredAt: registration.registeredAt,
  };
};

module.exports = {
  registerUserForCompetition,
  getUserRegistration,
};
