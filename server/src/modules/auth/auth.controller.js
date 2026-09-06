const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const authService = require('./auth.service');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  return res.status(200).json(new ApiResponse(200, result, 'User logged in successfully'));
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  return res.status(200).json(new ApiResponse(200, user, 'Current user profile fetched successfully'));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  return res.status(200).json(new ApiResponse(200, result, result.message));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const result = await authService.resetPassword(token, password);
  return res.status(200).json(new ApiResponse(200, result, result.message));
});

module.exports = {
  login,
  getMe,
  forgotPassword,
  resetPassword,
};
