const bcrypt = require('bcryptjs');
const ApiError = require('../../utils/ApiError');
const adminRepo = require('./admin.repository');
const authRepo = require('../auth/auth.repository');

const getAllUsers = async () => adminRepo.findAllUsers();

const createUser = async (data) => {
  const existing = await authRepo.findUserByEmail(data.email);
  if (existing) throw new ApiError(400, 'User with this email already exists');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.password, salt);

  return adminRepo.createUser(data.email, passwordHash, data.role, data.employee_id);
};

const updateUserRole = async (userId, role) => adminRepo.updateUserRole(userId, role);
const getAllRoles = async () => adminRepo.findAllRoles();
const getAllPermissions = async () => adminRepo.findAllPermissions();

module.exports = {
  getAllUsers,
  createUser,
  updateUserRole,
  getAllRoles,
  getAllPermissions,
};
