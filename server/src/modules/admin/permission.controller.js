const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const adminService = require('./admin.service');

const getPermissions = asyncHandler(async (req, res) => {
  const permissions = await adminService.getAllPermissions();
  return res.status(200).json(new ApiResponse(200, permissions, 'Permissions retrieved successfully'));
});

module.exports = {
  getPermissions,
};
