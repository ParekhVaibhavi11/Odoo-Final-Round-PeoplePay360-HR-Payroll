const validateSchedule = (body) => {
  const errors = [];
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Schedule name is required' });
  }
  if (!body.pattern || !Array.isArray(body.pattern) || body.pattern.length === 0) {
    errors.push({ field: 'pattern', message: 'A valid weekly schedule pattern array is required' });
  }
  return errors;
};

module.exports = {
  validateSchedule,
};
