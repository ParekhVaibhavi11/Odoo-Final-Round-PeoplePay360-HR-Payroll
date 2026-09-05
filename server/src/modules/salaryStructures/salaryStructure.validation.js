const validateSalaryStructure = (body) => {
  const errors = [];
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Salary structure name is required' });
  }
  if (!body.code || typeof body.code !== 'string' || body.code.trim().length === 0) {
    errors.push({ field: 'code', message: 'Salary structure code is required' });
  }
  return errors;
};

module.exports = {
  validateSalaryStructure,
};
