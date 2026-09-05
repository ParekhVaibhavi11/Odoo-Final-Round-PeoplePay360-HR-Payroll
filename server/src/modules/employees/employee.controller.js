const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { getPagination, formatPaginatedResponse } = require('../../utils/pagination');
const employeeService = require('./employee.service');

const getEmployees = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query.page, req.query.limit);
  const { search, department, status } = req.query;

  const { rows, total } = await employeeService.getAllEmployees({ page, limit, offset, search, department, status });
  const responseData = formatPaginatedResponse(rows, total, page, limit);

  return res.status(200).json(new ApiResponse(200, responseData, 'Employees retrieved successfully'));
});

const getEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.id);
  return res.status(200).json(new ApiResponse(200, employee, 'Employee details retrieved successfully'));
});

const createEmployee = asyncHandler(async (req, res) => {
  const newEmployee = await employeeService.createEmployee(req.body);
  return res.status(201).json(new ApiResponse(201, newEmployee, 'Employee created successfully'));
});

const updateEmployee = asyncHandler(async (req, res) => {
  const updatedEmployee = await employeeService.updateEmployee(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, updatedEmployee, 'Employee updated successfully'));
});

const deleteEmployee = asyncHandler(async (req, res) => {
  await employeeService.deleteEmployee(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, 'Employee deleted successfully'));
});

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
