const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { getPagination, formatPaginatedResponse } = require('../../utils/pagination');
const contractService = require('./contract.service');

const getContracts = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query.page, req.query.limit);
  const { employee_id, status } = req.query;

  const { rows, total } = await contractService.getAllContracts({ limit, offset, employee_id, status });
  const responseData = formatPaginatedResponse(rows, total, page, limit);

  return res.status(200).json(new ApiResponse(200, responseData, 'Contracts retrieved successfully'));
});

const getContract = asyncHandler(async (req, res) => {
  const contract = await contractService.getContractById(req.params.id);
  return res.status(200).json(new ApiResponse(200, contract, 'Contract details retrieved successfully'));
});

const createContract = asyncHandler(async (req, res) => {
  const newContract = await contractService.createContract(req.body);
  return res.status(201).json(new ApiResponse(201, newContract, 'Contract created successfully'));
});

const updateContract = asyncHandler(async (req, res) => {
  const updatedContract = await contractService.updateContract(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, updatedContract, 'Contract updated successfully'));
});

const deleteContract = asyncHandler(async (req, res) => {
  await contractService.deleteContract(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, 'Contract deleted successfully'));
});

module.exports = {
  getContracts,
  getContract,
  createContract,
  updateContract,
  deleteContract,
};
