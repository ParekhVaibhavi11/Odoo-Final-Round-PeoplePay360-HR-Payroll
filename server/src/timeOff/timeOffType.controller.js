const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const timeOffService = require('./timeOff.service');

const getTypes = asyncHandler(async (req, res) => {
  const types = await timeOffService.getAllTypes();
  return res.status(200).json(new ApiResponse(200, types, 'Time off types retrieved successfully'));
});

const getType = asyncHandler(async (req, res) => {
  const type = await timeOffService.getTypeById(req.params.id);
  return res.status(200).json(new ApiResponse(200, type, 'Time off type details retrieved successfully'));
});

const createType = asyncHandler(async (req, res) => {
  const newType = await timeOffService.createType(req.body);
  return res.status(201).json(new ApiResponse(201, newType, 'Time off type created successfully'));
});

const updateType = asyncHandler(async (req, res) => {
  const updatedType = await timeOffService.updateType(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, updatedType, 'Time off type updated successfully'));
});

const deleteType = asyncHandler(async (req, res) => {
  await timeOffService.deleteType(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, 'Time off type deleted successfully'));
});

module.exports = {
  getTypes,
  getType,
  createType,
  updateType,
  deleteType,
};
