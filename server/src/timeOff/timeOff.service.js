const ApiError = require('../../utils/ApiError');
const timeOffRepo = require('./timeOff.repository');
const employeeRepo = require('../employees/employee.repository');
const { getDaysInPeriod } = require('../../utils/dateUtils');

// --- Types ---
const getAllTypes = async () => timeOffRepo.findAllTypes();
const getTypeById = async (id) => {
  const type = await timeOffRepo.findTypeById(id);
  if (!type) throw new ApiError(404, 'Time Off Type not found');
  return type;
};
const createType = async (data) => timeOffRepo.createType(data);
const updateType = async (id, data) => {
  await getTypeById(id);
  return timeOffRepo.updateType(id, data);
};
const deleteType = async (id) => {
  await getTypeById(id);
  return timeOffRepo.deleteType(id);
};

// --- Allocations ---
const getAllAllocations = async (filter) => timeOffRepo.findAllAllocations(filter);
const getAllocationById = async (id) => {
  const allocation = await timeOffRepo.findAllocationById(id);
  if (!allocation) throw new ApiError(404, 'Leave Allocation not found');
  return allocation;
};
const createAllocation = async (data) => {
  const emp = await employeeRepo.findById(data.employee_id);
  if (!emp) throw new ApiError(404, 'Employee not found');
  await getTypeById(data.time_off_type_id);

  return timeOffRepo.createAllocation(data);
};
const updateAllocationStatus = async (id, status) => {
  await getAllocationById(id);
  return timeOffRepo.updateAllocationStatus(id, status);
};

// --- Leave Requests ---
const getAllRequests = async (filter) => timeOffRepo.findAllRequests(filter);
const getRequestById = async (id) => {
  const request = await timeOffRepo.findRequestById(id);
  if (!request) throw new ApiError(404, 'Leave Request not found');
  return request;
};

const createRequest = async (employeeId, data) => {
  const emp = await employeeRepo.findById(employeeId);
  if (!emp) throw new ApiError(404, 'Employee not found');

  const leaveType = await getTypeById(data.time_off_type_id);
  const duration = data.duration || getDaysInPeriod(data.start_date, data.end_date);

  let allocationId = null;

  // Check allocation requirement
  if (leaveType.requires_allocation) {
    const activeAllocation = await timeOffRepo.findActiveAllocation(
      employeeId,
      data.time_off_type_id,
      data.start_date
    );

    if (!activeAllocation) {
      throw new ApiError(400, `No active approved allocation balance found for leave type ${leaveType.name}`);
    }

    if (parseFloat(activeAllocation.remaining_amount) < duration) {
      throw new ApiError(
        400,
        `Insufficient leave balance. Remaining: ${activeAllocation.remaining_amount} ${leaveType.unit}, Requested: ${duration} ${leaveType.unit}`
      );
    }

    allocationId = activeAllocation.id;
  }

  return timeOffRepo.createRequest({
    employee_id: employeeId,
    time_off_type_id: data.time_off_type_id,
    allocation_id: allocationId,
    start_date: data.start_date,
    end_date: data.end_date,
    duration,
    status: 'PENDING',
  });
};

const updateRequestStatus = async (id, status) => {
  const req = await getRequestById(id);
  if (req.status === status) return req;

  if (status === 'APPROVED') {
    // If request required an allocation, deduct from allocation balance
    if (req.allocation_id) {
      const allocation = await timeOffRepo.findAllocationById(req.allocation_id);
      if (parseFloat(allocation.remaining_amount) < parseFloat(req.duration)) {
        throw new ApiError(400, 'Cannot approve request: Insufficient remaining allocation balance');
      }
      await timeOffRepo.deductAllocationBalance(req.allocation_id, parseFloat(req.duration));
    }
  }

  return timeOffRepo.updateRequestStatus(id, status);
};

module.exports = {
  getAllTypes,
  getTypeById,
  createType,
  updateType,
  deleteType,
  getAllAllocations,
  getAllocationById,
  createAllocation,
  updateAllocationStatus,
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
};
