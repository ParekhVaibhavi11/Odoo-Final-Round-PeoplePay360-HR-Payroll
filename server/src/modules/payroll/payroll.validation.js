const validatePayrunWizard = (body) => {
  const errors = [];
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Payrun batch name is required' });
  }
  if (!body.period_start || !body.period_end) {
    errors.push({ field: 'period', message: 'Period start and end dates are required' });
  }
  if (!body.salary_structure_id || isNaN(parseInt(body.salary_structure_id, 10))) {
    errors.push({ field: 'salary_structure_id', message: 'Valid salary structure ID is required' });
  }
  if (!body.employee_ids || !Array.isArray(body.employee_ids) || body.employee_ids.length === 0) {
    errors.push({ field: 'employee_ids', message: 'At least one employee must be selected for the payrun' });
  }
  return errors;
};

module.exports = {
  validatePayrunWizard,
};
