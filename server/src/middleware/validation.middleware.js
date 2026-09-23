const { AppError } = require('../utils/errors');

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Assign parsed values back to prevent prototype pollution or unexpected types
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;

      next();
    } catch (err) {
      if (err.errors) {
        const details = err.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        return next(new AppError('Validation failed', 400, 'VALIDATION_ERROR', details));
      }
      next(err);
    }
  };
};

module.exports = {
  validate,
};
