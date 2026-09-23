const express = require('express');
const submissionController = require('../controllers/submission.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/:submissionId', authenticate, submissionController.getSubmissionById);

module.exports = router;
