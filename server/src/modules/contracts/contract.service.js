const ApiError = require('../../utils/ApiError');
const contractRepo = require('./contract.repository');
const employeeRepo = require('../employees/employee.repository');

const getAllContracts = async ({ limit, offset, employee_id, status }) => {
  return await contractRepo.findAll({ limit, offset, employee_id, status });
};

const getContractById = async (id) => {
  const contract = await contractRepo.findById(id);
  if (!contract) {
    throw new ApiError(404, 'Contract record not found');
  }
  return contract;
};

const createContract = async (data) => {
  const employee = await employeeRepo.findById(data.employee_id);
  if (!employee) {
    throw new ApiError(404, 'Specified employee does not exist');
  }

  // Check for concurrent active contract for employee
  if (data.status === 'ACTIVE' || !data.status) {
    const overlapping = await contractRepo.findOverlappingActiveContracts(
      data.employee_id,
      data.start_date,
      data.end_date
    );
    if (overlapping.length > 0) {
      throw new ApiError(400, 'Employee already has an ACTIVE contract overlapping with these dates.');
    }
  }

  return await contractRepo.create(data);
};

const updateContract = async (id, data) => {
  const existing = await contractRepo.findById(id);
  if (!existing) {
    throw new ApiError(404, 'Contract record not found');
  }

  if (data.status === 'ACTIVE') {
    const overlapping = await contractRepo.findOverlappingActiveContracts(
      existing.employee_id,
      data.start_date || existing.start_date,
      data.end_date !== undefined ? data.end_date : existing.end_date,
      id
    );
    if (overlapping.length > 0) {
      throw new ApiError(400, 'Employee already has another ACTIVE contract overlapping with these dates.');
    }
  }

  return await contractRepo.update(id, data);
};

const deleteContract = async (id) => {
  const contract = await contractRepo.findById(id);
  if (!contract) {
    throw new ApiError(404, 'Contract record not found');
  }
  return await contractRepo.remove(id);
};

module.exports = {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
};
