const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { query } = require('../config/database');

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication token missing or invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    
    // Retrieve latest user info from DB
    const userRes = await query(
      'SELECT id, email, role, employee_id FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userRes.rows.length === 0) {
      throw new ApiError(401, 'User account no longer exists');
    }

    req.user = userRes.rows[0];
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, 'Invalid or expired authentication token');
  }
});

module.exports = {
  authenticate,
};
