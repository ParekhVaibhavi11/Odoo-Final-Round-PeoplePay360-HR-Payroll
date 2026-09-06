import api from '../config/api';

export const loginUser = async (email, password) => {
  return await api.post('/auth/login', { email, password });
};

export const forgotPassword = async (email) => {
  return await api.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token, password) => {
  return await api.post('/auth/reset-password', { token, password });
};

export const getMe = async () => {
  return await api.get('/auth/me');
};
