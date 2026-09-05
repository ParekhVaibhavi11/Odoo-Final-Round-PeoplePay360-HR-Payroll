const ApiError = require('../../utils/ApiError');
const structureRepo = require('./salaryStructure.repository');

const getAllStructures = async ({ limit, offset }) => {
  return await structureRepo.findAll({ limit, offset });
};

const getStructureById = async (id) => {
  const structure = await structureRepo.findById(id);
  if (!structure) {
    throw new ApiError(404, 'Salary Structure record not found');
  }
  return structure;
};

const createStructure = async (data) => {
  const existingCode = await structureRepo.findByCode(data.code);
  if (existingCode) {
    throw new ApiError(400, 'A salary structure with this code already exists');
  }
  return await structureRepo.create(data);
};

const updateStructure = async (id, data) => {
  const existing = await structureRepo.findById(id);
  if (!existing) {
    throw new ApiError(404, 'Salary Structure record not found');
  }

  if (data.code && data.code.toUpperCase() !== existing.code) {
    const existingCode = await structureRepo.findByCode(data.code);
    if (existingCode) {
      throw new ApiError(400, 'A salary structure with this code already exists');
    }
  }

  return await structureRepo.update(id, data);
};

const deleteStructure = async (id) => {
  const existing = await structureRepo.findById(id);
  if (!existing) {
    throw new ApiError(404, 'Salary Structure record not found');
  }
  return await structureRepo.remove(id);
};

module.exports = {
  getAllStructures,
  getStructureById,
  createStructure,
  updateStructure,
  deleteStructure,
};
