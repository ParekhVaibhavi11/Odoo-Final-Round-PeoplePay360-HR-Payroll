const { PAGINATION } = require('../config/constants');

const getPagination = (pageQuery, limitQuery) => {
  const page = Math.max(1, parseInt(pageQuery || PAGINATION.DEFAULT_PAGE, 10));
  const limit = Math.max(1, Math.min(100, parseInt(limitQuery || PAGINATION.DEFAULT_LIMIT, 10)));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

const formatPaginatedResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    items: data,
    pagination: {
      total: parseInt(total, 10),
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = {
  getPagination,
  formatPaginatedResponse,
};
