const validateContract = (body) => {
  const errors = [];
  if (!body.employee_id || isNaN(parseInt(body.employee_id, 10))) {
    errors.push({ field: 'employee_id', message: 'Valid employee ID is required' });
  }
  if (!body.start_date) {
    errors.push({ field: 'start_date', message: 'Start date is required' });
  }
  if (body.wage === undefined || isNaN(parseFloat(body.wage)) || parseFloat(body.wage) < 0) {
    errors.push({ field: 'wage', message: 'A valid non-negative wage is required' });
  }
  if (!body.department || typeof body.department !== 'string') {
    errors.push({ field: 'department', message: 'Department is required' });
  }
  if (!body.job_position || typeof body.job_position !== 'string') {
    errors.push({ field: 'job_position', message: 'Job position is required' });
  }
  return errors;
};

module.exports = {
  validateContract,
};
