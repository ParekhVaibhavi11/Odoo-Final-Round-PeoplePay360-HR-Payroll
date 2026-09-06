const validateCheckIn = (body) => {
  const errors = [];
  if (!body.employee_id || isNaN(parseInt(body.employee_id, 10))) {
    errors.push({ field: 'employee_id', message: 'Valid employee ID is required' });
  }
  return errors;
};

const validateCheckOut = (body) => {
  const errors = [];
  if (!body.employee_id || isNaN(parseInt(body.employee_id, 10))) {
    errors.push({ field: 'employee_id', message: 'Valid employee ID is required' });
  }
  return errors;
};

const validateManualCorrection = (body) => {
  const errors = [];
  if (!body.status || typeof body.status !== 'string') {
    errors.push({ field: 'status', message: 'Attendance status is required' });
  }
  return errors;
};

module.exports = {
  validateCheckIn,
  validateCheckOut,
  validateManualCorrection,
};
