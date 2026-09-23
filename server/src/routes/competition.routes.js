const express = require('express');
const competitionController = require('../controllers/competition.controller');
const registrationController = require('../controllers/registration.controller');
const submissionController = require('../controllers/submission.controller');
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { registrationLimiter } = require('../middleware/rateLimit.middleware');
const { competitionIdParamSchema } = require('../validators/competition.validator');
const { registerCompetitionParamSchema } = require('../validators/registration.validator');
const { createSubmissionSchema } = require('../validators/submission.validator');

const router = express.Router();

// Public / Guest Competitions routes
router.get('/', competitionController.listCompetitions);
router.get('/:id', validate(competitionIdParamSchema), optionalAuthenticate, competitionController.getCompetition);
router.get('/:id/results', validate(competitionIdParamSchema), competitionController.getResults);
router.get('/:id/reviews', validate(competitionIdParamSchema), competitionController.getReviews);

// Authenticated Registration routes
router.post(
  '/:id/register',
  validate(registerCompetitionParamSchema),
  authenticate,
  registrationLimiter,
  registrationController.registerForCompetition
);
router.get(
  '/:id/registration',
  validate(competitionIdParamSchema),
  authenticate,
  registrationController.getRegistration
);

// Authenticated Submission routes
router.post(
  '/:id/submissions',
  validate(createSubmissionSchema),
  authenticate,
  submissionController.createSubmission
);
router.get(
  '/:id/submissions/me',
  validate(competitionIdParamSchema),
  authenticate,
  submissionController.getMySubmission
);

module.exports = router;
