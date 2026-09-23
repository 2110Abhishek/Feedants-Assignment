const submissionService = require('../services/submission.service');
const { successResponse } = require('../utils/apiResponse');

const createSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const submission = await submissionService.createSubmission(id, req.user, req.body);
    return successResponse(res, { submission }, 'Submission uploaded successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getMySubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const submission = await submissionService.getMySubmission(id, req.user._id);
    return successResponse(res, { submission }, 'My submission retrieved');
  } catch (error) {
    next(error);
  }
};

const getSubmissionById = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const submission = await submissionService.getSubmissionById(submissionId);
    return successResponse(res, { submission }, 'Submission retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubmission,
  getMySubmission,
  getSubmissionById,
};
