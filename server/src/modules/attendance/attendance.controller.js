const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { getPagination, formatPaginatedResponse } = require('../../utils/pagination');
const attendanceService = require('./attendance.service');

const getAttendances = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query.page, req.query.limit);
  const { employee_id, startDate, endDate, status } = req.query;

  // Non-admin/HR users can only see their own attendance logs
  let filterEmpId = employee_id;
  if (req.user.role === 'EMPLOYEE') {
    filterEmpId = req.user.employee_id;
  }

  const { rows, total } = await attendanceService.getAllAttendances({
    limit,
    offset,
    employee_id: filterEmpId,
    startDate,
    endDate,
    status,
  });

  const responseData = formatPaginatedResponse(rows, total, page, limit);
  return res.status(200).json(new ApiResponse(200, responseData, 'Attendance logs retrieved successfully'));
});

const checkIn = asyncHandler(async (req, res) => {
  const employeeId = req.user.role === 'EMPLOYEE' ? req.user.employee_id : req.body.employee_id;
  const result = await attendanceService.checkIn(employeeId, req.body.check_in);
  return res.status(200).json(new ApiResponse(200, result, 'Check-in recorded successfully'));
});

const checkOut = asyncHandler(async (req, res) => {
  const employeeId = req.user.role === 'EMPLOYEE' ? req.user.employee_id : req.body.employee_id;
  const result = await attendanceService.checkOut(employeeId, req.body.check_out);
  return res.status(200).json(new ApiResponse(200, result, 'Check-out recorded successfully'));
});

const manualCorrection = asyncHandler(async (req, res) => {
  const result = await attendanceService.manualCorrection(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, result, 'Attendance entry corrected successfully'));
});

const deleteAttendance = asyncHandler(async (req, res) => {
  await attendanceService.deleteAttendance(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, 'Attendance record deleted successfully'));
});

const createAttendance = asyncHandler(async (req, res) => {
  const result = await attendanceService.createAttendance(req.body);
  return res.status(201).json(new ApiResponse(201, result, 'Attendance record created successfully'));
});

module.exports = {
  getAttendances,
  checkIn,
  checkOut,
  createAttendance,
  manualCorrection,
  deleteAttendance,
};
