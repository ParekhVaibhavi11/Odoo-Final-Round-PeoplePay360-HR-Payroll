const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const adminService = require('./admin.service');

const getRoles = asyncHandler(async (req, res) => {
  const roles = await adminService.getAllRoles();
  return res.status(200).json(new ApiResponse(200, roles, 'Roles retrieved successfully'));
});

module.exports = {
  getRoles,
};
