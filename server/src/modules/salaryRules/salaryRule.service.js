const ApiError = require('../../utils/ApiError');
const ruleRepo = require('./salaryRule.repository');
const structureRepo = require('../salaryStructures/salaryStructure.repository');

const getRulesByStructure = async (structureId) => {
  const structure = await structureRepo.findById(structureId);
  if (!structure) {
    throw new ApiError(404, 'Salary Structure record not found');
  }
  return await ruleRepo.findAllByStructure(structureId);
};

const getRuleById = async (id) => {
  const rule = await ruleRepo.findById(id);
  if (!rule) {
    throw new ApiError(404, 'Salary Rule record not found');
  }
  return rule;
};

const createRule = async (data) => {
  const structure = await structureRepo.findById(data.structure_id);
  if (!structure) {
    throw new ApiError(404, 'Specified Salary Structure record not found');
  }
  return await ruleRepo.create(data);
};

const updateRule = async (id, data) => {
  const rule = await ruleRepo.findById(id);
  if (!rule) {
    throw new ApiError(404, 'Salary Rule record not found');
  }
  return await ruleRepo.update(id, data);
};

const deleteRule = async (id) => {
  const rule = await ruleRepo.findById(id);
  if (!rule) {
    throw new ApiError(404, 'Salary Rule record not found');
  }
  return await ruleRepo.remove(id);
};

module.exports = {
  getRulesByStructure,
  getRuleById,
  createRule,
  updateRule,
  deleteRule,
};
