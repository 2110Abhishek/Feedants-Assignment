const Submission = require('../models/Submission');
const Registration = require('../models/Registration');
const Competition = require('../models/Competition');
const { AppError } = require('../utils/errors');

const createSubmission = async (competitionId, user, { title, description, mediaUrl, thumbnailUrl }) => {
  const competition = await Competition.findById(competitionId);
  if (!competition) {
    throw new AppError('Competition not found', 404, 'COMPETITION_NOT_FOUND');
  }

  const now = new Date();
  if (now < competition.submissionStartAt) {
    throw new AppError('Submission period has not started yet', 400, 'SUBMISSION_NOT_STARTED');
  }
  if (now >= competition.submissionEndAt) {
    throw new AppError('Submission deadline has passed', 400, 'SUBMISSION_CLOSED');
  }

  const registration = await Registration.findOne({
    competitionId,
    userId: user._id,
    status: 'REGISTERED',
  });

  if (!registration) {
    throw new AppError('You must be registered for this competition to submit an entry', 403, 'REGISTRATION_REQUIRED');
  }

  // Check if existing submission exists
  let submission = await Submission.findOne({
    competitionId,
    userId: user._id,
  });

  if (submission) {
    // Update existing submission
    submission.title = title;
    if (description !== undefined) submission.description = description;
    submission.mediaUrl = mediaUrl;
    if (thumbnailUrl) submission.thumbnailUrl = thumbnailUrl;
    submission.status = 'SUBMITTED';
    submission.submittedAt = now;
    await submission.save();
    return submission;
  }

  submission = await Submission.create({
    competitionId,
    userId: user._id,
    registrationId: registration._id,
    title,
    description,
    mediaUrl,
    thumbnailUrl,
    status: 'SUBMITTED',
    submittedAt: now,
  });

  return submission;
};

const getMySubmission = async (competitionId, userId) => {
  const submission = await Submission.findOne({
    competitionId,
    userId,
  });
  return submission;
};

const getSubmissionById = async (submissionId) => {
  const submission = await Submission.findById(submissionId).populate('userId', 'name profileImageUrl');
  if (!submission) {
    throw new AppError('Submission not found', 404, 'SUBMISSION_NOT_FOUND');
  }
  return submission;
};

module.exports = {
  createSubmission,
  getMySubmission,
  getSubmissionById,
};
