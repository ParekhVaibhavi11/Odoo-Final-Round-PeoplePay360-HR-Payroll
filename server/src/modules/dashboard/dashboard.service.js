const dashboardRepo = require('./dashboard.repository');

const getDashboardData = async (filters) => {
  return await dashboardRepo.getLiveMetrics(filters);
};

module.exports = {
  getDashboardData,
};
