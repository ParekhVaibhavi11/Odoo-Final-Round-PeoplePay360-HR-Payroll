const validateEmployee = (body) => {
  const errors = [];
  if (!body.first_name || typeof body.first_name !== 'string' || body.first_name.trim().length === 0) {
    errors.push({ field: 'first_name', message: 'First name is required' });
  }
  if (!body.last_name || typeof body.last_name !== 'string' || body.last_name.trim().length === 0) {
    errors.push({ field: 'last_name', message: 'Last name is required' });
  }
  if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  }
  if (!body.department || typeof body.department !== 'string' || body.department.trim().length === 0) {
    errors.push({ field: 'department', message: 'Department is required' });
  }
  if (!body.job_position || typeof body.job_position !== 'string' || body.job_position.trim().length === 0) {
    errors.push({ field: 'job_position', message: 'Job position is required' });
  }
  return errors;
};

module.exports = {
  validateEmployee,
};
