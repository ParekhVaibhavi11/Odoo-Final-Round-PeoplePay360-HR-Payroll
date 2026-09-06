const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { getPagination, formatPaginatedResponse } = require('../../utils/pagination');
const timeOffService = require('./timeOff.service');

const getAllocations = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query.page, req.query.limit);
  const { employee_id, status } = req.query;

  let filterEmpId = employee_id;
  if (req.user.role === 'EMPLOYEE') {
    filterEmpId = req.user.employee_id;
  }

  const { rows, total } = await timeOffService.getAllAllocations({
    limit,
    offset,
    employee_id: filterEmpId,
    status,
  });

  const responseData = formatPaginatedResponse(rows, total, page, limit);
  return res.status(200).json(new ApiResponse(200, responseData, 'Leave allocations retrieved successfully'));
});

const getAllocation = asyncHandler(async (req, res) => {
  const allocation = await timeOffService.getAllocationById(req.params.id);
  return res.status(200).json(new ApiResponse(200, allocation, 'Leave allocation details retrieved successfully'));
});

const createAllocation = asyncHandler(async (req, res) => {
  const newAllocation = await timeOffService.createAllocation(req.body);
  return res.status(201).json(new ApiResponse(201, newAllocation, 'Leave allocation created successfully'));
});

const updateAllocationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const updated = await timeOffService.updateAllocationStatus(req.params.id, status);
  return res.status(200).json(new ApiResponse(200, updated, `Leave allocation status updated to ${status}`));
});

module.exports = {
  getAllocations,
  getAllocation,
  createAllocation,
  updateAllocationStatus,
};
