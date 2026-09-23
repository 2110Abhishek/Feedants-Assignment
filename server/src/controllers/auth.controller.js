const authService = require('../services/auth.service');
const { successResponse } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return successResponse(res, result, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return successResponse(res, result, 'Login successful', 200);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user._id);
    return successResponse(res, { user }, 'User profile retrieved', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
