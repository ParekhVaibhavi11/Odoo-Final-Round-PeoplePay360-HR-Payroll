const ApiError = require('../../utils/ApiError');
const employeeRepo = require('./employee.repository');

const getAllEmployees = async ({ page, limit, offset, search, department, status }) => {
  return await employeeRepo.findAll({ limit, offset, search, department, status });
};

const getEmployeeById = async (id) => {
  const employee = await employeeRepo.findById(id);
  if (!employee) {
    throw new ApiError(404, 'Employee record not found');
  }
  return employee;
};

const createEmployee = async (data) => {
  const existingEmail = await employeeRepo.findByEmail(data.email);
  if (existingEmail) {
    throw new ApiError(400, 'An employee with this email already exists');
  }

  // Auto-generate employee number if not provided (EMP-001 format)
  let employeeNumber = data.employee_number;
  if (!employeeNumber) {
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(100 + Math.random() * 900);
    employeeNumber = `EMP-${timestamp}${random}`;
  } else {
    const existingNum = await employeeRepo.findByEmployeeNumber(employeeNumber);
    if (existingNum) {
      throw new ApiError(400, 'Employee number must be unique');
    }
  }

  return await employeeRepo.create({
    ...data,
    employee_number: employeeNumber,
  });
};

const updateEmployee = async (id, data) => {
  const employee = await employeeRepo.findById(id);
  if (!employee) {
    throw new ApiError(404, 'Employee record not found');
  }

  if (data.email && data.email !== employee.email) {
    const existingEmail = await employeeRepo.findByEmail(data.email);
    if (existingEmail) {
      throw new ApiError(400, 'An employee with this email already exists');
    }
  }

  return await employeeRepo.update(id, data);
};

const deleteEmployee = async (id) => {
  const employee = await employeeRepo.findById(id);
  if (!employee) {
    throw new ApiError(404, 'Employee record not found');
  }
  return await employeeRepo.remove(id);
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
