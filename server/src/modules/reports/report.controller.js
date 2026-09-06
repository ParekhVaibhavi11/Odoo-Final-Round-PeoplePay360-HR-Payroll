const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const reportService = require('./report.service');

const getPayrollReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const data = await reportService.getSummary(startDate, endDate);
  return res.status(200).json(new ApiResponse(200, data, 'Payroll summary report generated successfully'));
});

const getEmployeeSalaryReport = asyncHandler(async (req, res) => {
  const data = await reportService.getEmployeeSalaryReport();
  return res.status(200).json(new ApiResponse(200, data, 'Employee salary report generated successfully'));
});

const getAttendanceReport = asyncHandler(async (req, res) => {
  const data = await reportService.getAttendanceReport();
  return res.status(200).json(new ApiResponse(200, data, 'Attendance summary report generated successfully'));
});

module.exports = {
  getPayrollReport,
  getEmployeeSalaryReport,
  getAttendanceReport,
};
