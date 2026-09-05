const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { getPagination, formatPaginatedResponse } = require('../../utils/pagination');
const timeOffService = require('./timeOff.service');

const getRequests = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query.page, req.query.limit);
  const { employee_id, status } = req.query;

  let filterEmpId = employee_id;
  if (req.user.role === 'EMPLOYEE') {
    filterEmpId = req.user.employee_id;
  }

  const { rows, total } = await timeOffService.getAllRequests({
    limit,
    offset,
    employee_id: filterEmpId,
    status,
  });

  const responseData = formatPaginatedResponse(rows, total, page, limit);
  return res.status(200).json(new ApiResponse(200, responseData, 'Leave requests retrieved successfully'));
});

const getRequest = asyncHandler(async (req, res) => {
  const request = await timeOffService.getRequestById(req.params.id);
  return res.status(200).json(new ApiResponse(200, request, 'Leave request details retrieved successfully'));
});

const createRequest = asyncHandler(async (req, res) => {
  const employeeId = req.user.role === 'EMPLOYEE' ? req.user.employee_id : req.body.employee_id;
  const newRequest = await timeOffService.createRequest(employeeId, req.body);
  return res.status(201).json(new ApiResponse(201, newRequest, 'Leave request submitted successfully'));
});

const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const updated = await timeOffService.updateRequestStatus(req.params.id, status);
  return res.status(200).json(new ApiResponse(200, updated, `Leave request status updated to ${status}`));
});

module.exports = {
  getRequests,
  getRequest,
  createRequest,
  updateRequestStatus,
};
