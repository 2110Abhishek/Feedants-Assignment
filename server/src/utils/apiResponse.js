/**
 * Standardized API Response Helper
 */
const successResponse = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

const errorResponse = (res, message = 'An error occurred', statusCode = 500, code = 'SERVER_ERROR', details = null) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
