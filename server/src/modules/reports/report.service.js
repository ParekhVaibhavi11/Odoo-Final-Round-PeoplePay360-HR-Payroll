const reportRepo = require('./report.repository');

const getSummary = async (startDate, endDate) => {
  return await reportRepo.getPayrollSummaryReport(startDate || '2000-01-01', endDate || '2099-12-31');
};

const getEmployeeSalaryReport = async () => {
  return await reportRepo.getEmployeeSalaryReport();
};

const getAttendanceReport = async () => {
  return await reportRepo.getAttendanceReport();
};

module.exports = {
  getSummary,
  getEmployeeSalaryReport,
  getAttendanceReport,
};
