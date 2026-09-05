const ApiError = require('../utils/ApiError');
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  const response = {
    statusCode: error.statusCode,
    message: error.message,
    success: false,
    errors: error.errors || [],
    ...(env.nodeEnv === 'development' && { stack: error.stack }),
  };

  if (env.nodeEnv === 'development') {
    console.error(`[Error Handler] ${req.method} ${req.url}:`, err);
  }

  return res.status(error.statusCode).json(response);
};

module.exports = {
  errorHandler,
};
