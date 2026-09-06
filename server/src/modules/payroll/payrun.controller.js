const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { getPagination, formatPaginatedResponse } = require('../../utils/pagination');
const payrollService = require('./payroll.service');

const getPayruns = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query.page, req.query.limit);
  const { status } = req.query;

  const { rows, total } = await payrollService.getAllPayruns({ limit, offset, status });
  const responseData = formatPaginatedResponse(rows, total, page, limit);

  return res.status(200).json(new ApiResponse(200, responseData, 'Payruns retrieved successfully'));
});

const getPayrun = asyncHandler(async (req, res) => {
  const payrun = await payrollService.getPayrunById(req.params.id);
  return res.status(200).json(new ApiResponse(200, payrun, 'Payrun details retrieved successfully'));
});

const createAndComputePayrun = asyncHandler(async (req, res) => {
  const payrun = await payrollService.createAndComputePayrun(req.body, req.user.id);
  return res.status(201).json(new ApiResponse(201, payrun, 'Payrun batch created and computed successfully'));
});

const validatePayrun = asyncHandler(async (req, res) => {
  const payrun = await payrollService.validatePayrun(req.params.id);
  return res.status(200).json(new ApiResponse(200, payrun, 'Payrun batch validated successfully'));
});

const markPayrunPaid = asyncHandler(async (req, res) => {
  const payrun = await payrollService.markPayrunPaid(req.params.id);
  return res.status(200).json(new ApiResponse(200, payrun, 'Payrun marked as paid successfully'));
});

const deletePayrun = asyncHandler(async (req, res) => {
  await payrollService.deletePayrun(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, 'Payrun batch deleted successfully'));
});

module.exports = {
  getPayruns,
  getPayrun,
  createAndComputePayrun,
  validatePayrun,
  markPayrunPaid,
  deletePayrun,
};
