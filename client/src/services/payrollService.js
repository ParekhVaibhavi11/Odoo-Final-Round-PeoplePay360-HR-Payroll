import api from '../config/api';

export const getPayruns = async (params) => {
  return await api.get('/payroll/payruns', { params });
};

export const getPayrunById = async (id) => {
  return await api.get(`/payroll/payruns/${id}`);
};

export const createAndComputePayrun = async (data) => {
  return await api.post('/payroll/payruns', data);
};

export const validatePayrun = async (id) => {
  return await api.put(`/payroll/payruns/${id}/validate`);
};

export const markPayrunPaid = async (id) => {
  return await api.put(`/payroll/payruns/${id}/mark-paid`);
};

export const deletePayrun = async (id) => {
  return await api.delete(`/payroll/payruns/${id}`);
};

export const getPayslipById = async (id) => {
  return await api.get(`/payroll/payslips/${id}`);
};

export const sendPayslipEmail = async (id) => {
  return await api.post(`/payroll/payslips/${id}/email`);
};

export const sendBulkPayslipsEmail = async (payrunId) => {
  return await api.post(`/payroll/payruns/${payrunId}/send-payslips`);
};
