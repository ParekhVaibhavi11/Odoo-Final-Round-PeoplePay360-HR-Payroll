const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const reportService = require('./report.service');

const getPayrollReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const data = await reportService.getSummary(startDate, endDate);
  return res.status(200).json(new ApiResponse(200, data, 'Payroll summary report generated successfully'));
});

module.exports = {
  getPayrollReport,
};
