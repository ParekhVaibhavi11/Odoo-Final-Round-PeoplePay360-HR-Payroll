const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { getPagination, formatPaginatedResponse } = require('../../utils/pagination');
const structureService = require('./salaryStructure.service');

const getStructures = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query.page, req.query.limit);
  const { rows, total } = await structureService.getAllStructures({ limit, offset });
  const responseData = formatPaginatedResponse(rows, total, page, limit);

  return res.status(200).json(new ApiResponse(200, responseData, 'Salary structures retrieved successfully'));
});

const getStructure = asyncHandler(async (req, res) => {
  const structure = await structureService.getStructureById(req.params.id);
  return res.status(200).json(new ApiResponse(200, structure, 'Salary structure details retrieved successfully'));
});

const createStructure = asyncHandler(async (req, res) => {
  const newStructure = await structureService.createStructure(req.body);
  return res.status(201).json(new ApiResponse(201, newStructure, 'Salary structure created successfully'));
});

const updateStructure = asyncHandler(async (req, res) => {
  const updatedStructure = await structureService.updateStructure(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, updatedStructure, 'Salary structure updated successfully'));
});

const deleteStructure = asyncHandler(async (req, res) => {
  await structureService.deleteStructure(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, 'Salary structure deleted successfully'));
});

module.exports = {
  getStructures,
  getStructure,
  createStructure,
  updateStructure,
  deleteStructure,
};
