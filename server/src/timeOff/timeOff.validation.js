const validateTimeOffType = (body) => {
  const errors = [];
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Time off type name is required' });
  }
  if (!body.code || typeof body.code !== 'string' || body.code.trim().length === 0) {
    errors.push({ field: 'code', message: 'Time off type code is required' });
  }
  return errors;
};

const validateAllocation = (body) => {
  const errors = [];
  if (!body.employee_id || isNaN(parseInt(body.employee_id, 10))) {
    errors.push({ field: 'employee_id', message: 'Valid employee ID is required' });
  }
  if (!body.time_off_type_id || isNaN(parseInt(body.time_off_type_id, 10))) {
    errors.push({ field: 'time_off_type_id', message: 'Valid time off type ID is required' });
  }
  if (body.allocated_amount === undefined || isNaN(parseFloat(body.allocated_amount)) || parseFloat(body.allocated_amount) <= 0) {
    errors.push({ field: 'allocated_amount', message: 'Positive allocated amount is required' });
  }
  if (!body.validity_start || !body.validity_end) {
    errors.push({ field: 'validity', message: 'Validity start and end dates are required' });
  }
  return errors;
};

const validateRequest = (body) => {
  const errors = [];
  if (!body.time_off_type_id || isNaN(parseInt(body.time_off_type_id, 10))) {
    errors.push({ field: 'time_off_type_id', message: 'Valid time off type ID is required' });
  }
  if (!body.start_date || !body.end_date) {
    errors.push({ field: 'dates', message: 'Start and end dates are required' });
  }
  return errors;
};

module.exports = {
  validateTimeOffType,
  validateAllocation,
  validateRequest,
};
