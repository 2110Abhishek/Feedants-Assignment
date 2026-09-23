const registrationService = require('../services/registration.service');
const { successResponse } = require('../utils/apiResponse');

const registerForCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await registrationService.registerUserForCompetition(id, req.user, req.body);
    return successResponse(res, result, 'Successfully registered for competition', 201);
  } catch (error) {
    next(error);
  }
};

const getRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const registration = await registrationService.getUserRegistration(id, req.user._id);
    return successResponse(res, { registration }, 'Registration details retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerForCompetition,
  getRegistration,
};
