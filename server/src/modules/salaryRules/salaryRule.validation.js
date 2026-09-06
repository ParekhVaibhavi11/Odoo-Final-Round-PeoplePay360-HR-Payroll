const validateSalaryRule = (body) => {
  const errors = [];
  if (!body.structure_id || isNaN(parseInt(body.structure_id, 10))) {
    errors.push({ field: 'structure_id', message: 'Valid structure ID is required' });
  }
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Salary rule name is required' });
  }
  if (!body.code || typeof body.code !== 'string' || body.code.trim().length === 0) {
    errors.push({ field: 'code', message: 'Salary rule code is required' });
  }
  if (!body.category || !['BASIC', 'ALLOWANCE', 'GROSS', 'DEDUCTION', 'NET'].includes(body.category)) {
    errors.push({ field: 'category', message: 'Valid category (BASIC, ALLOWANCE, GROSS, DEDUCTION, NET) is required' });
  }
  if (!body.computation_type || !['FIXED', 'PERCENTAGE', 'FORMULA'].includes(body.computation_type)) {
    errors.push({ field: 'computation_type', message: 'Valid computation type (FIXED, PERCENTAGE, FORMULA) is required' });
  }
  return errors;
};

module.exports = {
  validateSalaryRule,
};
