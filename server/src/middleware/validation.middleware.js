const ApiError = require('../utils/ApiError');

/**
 * Higher-order middleware function to run validation rules
 * @param {Function} validatorFn - Function accepting (req.body, req.params, req.query) returning errors array
 */
const validate = (validatorFn) => {
  return (req, res, next) => {
    const errors = validatorFn(req.body, req.params, req.query);
    if (errors && errors.length > 0) {
      return next(new ApiError(400, 'Validation Error', errors));
    }
    next();
  };
};

module.exports = {
  validate,
};
