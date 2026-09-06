const validateLogin = (body) => {
  const errors = [];
  if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  }
  if (!body.password || typeof body.password !== 'string' || body.password.length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  }
  return errors;
};

const validateForgotPassword = (body) => {
  const errors = [];
  if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  }
  return errors;
};

const validateResetPassword = (body) => {
  const errors = [];
  if (!body.token || typeof body.token !== 'string') {
    errors.push({ field: 'token', message: 'Password reset token is required' });
  }
  if (!body.password || typeof body.password !== 'string' || body.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }
  return errors;
};

module.exports = {
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
};
