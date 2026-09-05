const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const adminService = require('./admin.service');

const getUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();
  return res.status(200).json(new ApiResponse(200, users, 'Users retrieved successfully'));
});

const createUser = asyncHandler(async (req, res) => {
  const newUser = await adminService.createUser(req.body);
  return res.status(201).json(new ApiResponse(201, newUser, 'User created successfully'));
});

const updateUserRole = asyncHandler(async (req, res) => {
  const updated = await adminService.updateUserRole(req.params.id, req.body.role);
  return res.status(200).json(new ApiResponse(200, updated, 'User role updated successfully'));
});

module.exports = {
  getUsers,
  createUser,
  updateUserRole,
};
