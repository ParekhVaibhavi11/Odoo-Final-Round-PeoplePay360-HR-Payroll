import api from '../config/api';

export const getEmployees = async (params) => {
  return await api.get('/employees', { params });
};

export const getEmployeeById = async (id) => {
  return await api.get(`/employees/${id}`);
};

export const createEmployee = async (data) => {
  return await api.post('/employees', data);
};

export const updateEmployee = async (id, data) => {
  return await api.put(`/employees/${id}`, data);
};

export const deleteEmployee = async (id) => {
  return await api.delete(`/employees/${id}`);
};
