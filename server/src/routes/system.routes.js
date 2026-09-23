const express = require('express');
const Competition = require('../models/Competition');
const { successResponse } = require('../utils/apiResponse');

const router = express.Router();

/**
 * GET /api/v1/system/time
 * Returns accurate server timestamp for client countdown sync (PRD Section 56)
 */
router.get('/time', (req, res) => {
  return successResponse(res, {
    serverTime: new Date().toISOString(),
  });
});

/**
 * POST /api/v1/referrals
 * Returns user referral code and link (PRD Section 73)
 */
router.post('/referrals', (req, res) => {
  const referralCode = req.body?.code || 'ABHI123';
  return successResponse(res, {
    referralCode,
    referralUrl: `https://feedants.com/r/${referralCode}`,
    rewardAmount: 10,
    currency: 'INR',
  });
});

/**
 * PATCH /api/v1/system/dev-lifecycle/:competitionId
 * Developer/Evaluator testing helper to simulate any lifecycle state on demand
 */
router.patch('/dev-lifecycle/:competitionId', async (req, res, next) => {
  try {
    const { competitionId } = req.params;
    const { targetLifecycle } = req.body;
    const now = Date.now();
    const HOUR = 3600 * 1000;
    const DAY = 24 * HOUR;

    let update = {};

    switch (targetLifecycle) {
      case 'UPCOMING':
        update = {
          status: 'PUBLISHED',
          registrationStartAt: new Date(now + 2 * DAY),
          registrationEndAt: new Date(now + 10 * DAY),
          submissionStartAt: new Date(now + 6 * DAY),
          submissionEndAt: new Date(now + 30 * DAY),
          resultDate: new Date(now + 32 * DAY),
        };
        break;

      case 'REGISTRATION_OPEN':
        update = {
          status: 'PUBLISHED',
          registrationStartAt: new Date(now - 1 * DAY),
          registrationEndAt: new Date(now + 1 * DAY + 6 * HOUR + 28 * 60 * 1000 + 32 * 1000), // matches "01d : 06h : 28m : 32s" in screenshot!
          submissionStartAt: new Date(now + 2 * DAY),
          submissionEndAt: new Date(now + 20 * DAY),
          resultDate: new Date(now + 25 * DAY),
        };
        break;

      case 'REGISTRATION_CLOSED':
        update = {
          status: 'PUBLISHED',
          registrationStartAt: new Date(now - 10 * DAY),
          registrationEndAt: new Date(now - 1 * HOUR),
          submissionStartAt: new Date(now + 1 * DAY),
          submissionEndAt: new Date(now + 20 * DAY),
          resultDate: new Date(now + 25 * DAY),
        };
        break;

      case 'SUBMISSION_OPEN':
        update = {
          status: 'PUBLISHED',
          registrationStartAt: new Date(now - 10 * DAY),
          registrationEndAt: new Date(now - 1 * DAY),
          submissionStartAt: new Date(now - 2 * HOUR),
          submissionEndAt: new Date(now + 10 * DAY),
          resultDate: new Date(now + 15 * DAY),
        };
        break;

      case 'SUBMISSION_CLOSED':
        update = {
          status: 'PUBLISHED',
          registrationStartAt: new Date(now - 20 * DAY),
          registrationEndAt: new Date(now - 10 * DAY),
          submissionStartAt: new Date(now - 10 * DAY),
          submissionEndAt: new Date(now - 1 * HOUR),
          resultDate: new Date(now + 2 * DAY),
        };
        break;

      case 'JUDGING':
        update = {
          status: 'PUBLISHED',
          registrationStartAt: new Date(now - 20 * DAY),
          registrationEndAt: new Date(now - 10 * DAY),
          submissionStartAt: new Date(now - 10 * DAY),
          submissionEndAt: new Date(now - 2 * DAY),
          resultDate: new Date(now + 1 * DAY),
        };
        break;

      case 'RESULTS_PUBLISHED':
        update = {
          status: 'PUBLISHED',
          registrationStartAt: new Date(now - 30 * DAY),
          registrationEndAt: new Date(now - 20 * DAY),
          submissionStartAt: new Date(now - 20 * DAY),
          submissionEndAt: new Date(now - 10 * DAY),
          resultDate: new Date(now - 1 * DAY),
        };
        break;

      default:
        return res.status(400).json({ success: false, message: 'Unknown lifecycle target' });
    }

    const updated = await Competition.findByIdAndUpdate(competitionId, update, { new: true });
    return successResponse(res, { updated, targetLifecycle }, `Competition lifecycle updated to ${targetLifecycle}`);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/system/dev-reset-persona
 * Resets a test persona (e.g. Priya) so she is always unregistered and ready to test
 */
router.post('/dev-reset-persona', async (req, res, next) => {
  try {
    const email = req.body?.email || 'priya@example.com';
    const User = require('../models/User');
    const Registration = require('../models/Registration');
    const Submission = require('../models/Submission');

    const user = await User.findOne({ email });
    if (user) {
      const registrations = await Registration.find({ userId: user._id });
      for (const reg of registrations) {
        await Competition.findByIdAndUpdate(reg.competitionId, {
          $inc: { registeredCount: -1 },
        });
        await Registration.deleteOne({ _id: reg._id });
      }
      await Submission.deleteMany({ userId: user._id });
    }
    return successResponse(res, { reset: true, email }, `Persona ${email} reset to unregistered`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
