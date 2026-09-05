const reportRepo = require('./report.repository');

const getSummary = async (startDate, endDate) => {
  return await reportRepo.getPayrollSummaryReport(startDate || '2000-01-01', endDate || '2099-12-31');
};

module.exports = {
  getSummary,
};
