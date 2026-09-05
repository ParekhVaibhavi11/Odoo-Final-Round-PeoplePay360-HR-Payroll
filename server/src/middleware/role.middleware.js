const ApiError = require('../utils/ApiError');

/**
 * Middleware factory for Role-Based Access Control
 * @param  {...string} allowedRoles 
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'User is not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access forbidden: Required role [${allowedRoles.join(', ')}], but your role is [${req.user.role}]`
        )
      );
    }

    next();
  };
};

module.exports = {
  authorize,
};
