const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const dashboardService = require('./dashboard.service');

const getDashboard = asyncHandler(async (req, res) => {
  const { department, employeeType } = req.query;
  const isEmployeeRole = req.user.role === 'EMPLOYEE';
  const employeeId = req.user.employee_id;

  const data = await dashboardService.getDashboardData({
    department,
    employeeType,
    employeeId,
    isEmployeeRole,
  });
  
  return res.status(200).json(new ApiResponse(200, data, 'Dashboard live metrics retrieved successfully'));
});

module.exports = {
  getDashboard,
};
