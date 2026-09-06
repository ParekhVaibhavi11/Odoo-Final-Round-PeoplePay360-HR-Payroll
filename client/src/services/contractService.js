import api from '../config/api';

export const getContracts = async (params) => {
  return await api.get('/contracts', { params });
};

export const getContractById = async (id) => {
  return await api.get(`/contracts/${id}`);
};

export const createContract = async (data) => {
  return await api.post('/contracts', data);
};

export const updateContract = async (id, data) => {
  return await api.put(`/contracts/${id}`, data);
};

export const deleteContract = async (id) => {
  return await api.delete(`/contracts/${id}`);
};
