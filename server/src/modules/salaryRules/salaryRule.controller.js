const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ruleService = require('./salaryRule.service');

const getRulesByStructure = asyncHandler(async (req, res) => {
  const rules = await ruleService.getRulesByStructure(req.params.structureId);
  return res.status(200).json(new ApiResponse(200, rules, 'Salary rules for structure retrieved successfully'));
});

const getRule = asyncHandler(async (req, res) => {
  const rule = await ruleService.getRuleById(req.params.id);
  return res.status(200).json(new ApiResponse(200, rule, 'Salary rule details retrieved successfully'));
});

const createRule = asyncHandler(async (req, res) => {
  const newRule = await ruleService.createRule(req.body);
  return res.status(201).json(new ApiResponse(201, newRule, 'Salary rule created successfully'));
});

const updateRule = asyncHandler(async (req, res) => {
  const updatedRule = await ruleService.updateRule(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, updatedRule, 'Salary rule updated successfully'));
});

const deleteRule = asyncHandler(async (req, res) => {
  await ruleService.deleteRule(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, 'Salary rule deleted successfully'));
});

module.exports = {
  getRulesByStructure,
  getRule,
  createRule,
  updateRule,
  deleteRule,
};
