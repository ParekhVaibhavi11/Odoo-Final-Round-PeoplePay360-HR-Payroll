const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../../config/env');
const ApiError = require('../../utils/ApiError');
const authRepo = require('./auth.repository');
const { sendPasswordResetEmail } = require('../../utils/mailer');

const login = async (email, password) => {
  const user = await authRepo.findUserByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Invalid email or password credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password credentials');
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    employeeId: user.employee_id,
  };

  const token = jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

  // Exclude password_hash from returned user profile
  delete user.password_hash;

  return {
    user,
    token,
  };
};

const getCurrentUser = async (userId) => {
  const user = await authRepo.findUserById(userId);
  if (!user) {
    throw new ApiError(404, 'User account not found');
  }
  return user;
};

const forgotPassword = async (email) => {
  const user = await authRepo.findUserByEmail(email);
  if (!user) {
    // Return success message regardless to prevent account enumeration
    return { message: 'If an account exists with that email, a password reset link has been sent.' };
  }

  // Generate plain random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  // Hash token for database storage
  const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Token valid for 30 minutes
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await authRepo.createPasswordResetToken(user.id, tokenHash, expiresAt);

  try {
    await sendPasswordResetEmail(user.email, resetToken);
  } catch (emailErr) {
    console.error('Error sending password reset email:', emailErr);
    // Don't throw to caller, allow quiet logging
  }

  return { message: 'If an account exists with that email, a password reset link has been sent.' };
};

const resetPassword = async (token, newPassword) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const resetRecord = await authRepo.findValidResetToken(tokenHash);

  if (!resetRecord) {
    throw new ApiError(400, 'Invalid or expired password reset token');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  await authRepo.updateUserPassword(resetRecord.user_id, passwordHash);
  await authRepo.markTokenAsUsed(resetRecord.id);

  return { message: 'Password has been successfully updated. You can now log in.' };
};

module.exports = {
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};
