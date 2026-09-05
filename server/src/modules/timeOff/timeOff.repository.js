const { query } = require('../../config/database');

// --- Time Off Types ---
const findAllTypes = async () => {
  const res = await query('SELECT * FROM time_off_types ORDER BY id ASC');
  return res.rows;
};

const findTypeById = async (id) => {
  const res = await query('SELECT * FROM time_off_types WHERE id = $1', [id]);
  return res.rows[0] || null;
};

const createType = async (data) => {
  const { name, code, unit, requires_allocation } = data;
  const sql = `
    INSERT INTO time_off_types (name, code, unit, requires_allocation)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const res = await query(sql, [name, code.toUpperCase(), unit || 'DAYS', requires_allocation !== false]);
  return res.rows[0];
};

const updateType = async (id, data) => {
  const { name, code, unit, requires_allocation } = data;
  const sql = `
    UPDATE time_off_types
    SET name = $1, code = $2, unit = $3, requires_allocation = $4, updated_at = NOW()
    WHERE id = $5
    RETURNING *
  `;
  const res = await query(sql, [name, code.toUpperCase(), unit || 'DAYS', requires_allocation !== false, id]);
  return res.rows[0];
};

const deleteType = async (id) => {
  const res = await query('DELETE FROM time_off_types WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

// --- Allocations ---
const findAllAllocations = async ({ limit, offset, employee_id, status }) => {
  let whereClauses = [];
  let params = [];
  let paramCount = 1;

  if (employee_id) {
    whereClauses.push(`toa.employee_id = $${paramCount}`);
    params.push(employee_id);
    paramCount++;
  }

  if (status) {
    whereClauses.push(`toa.status = $${paramCount}`);
    params.push(status);
    paramCount++;
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const dataSql = `
    SELECT toa.*, e.first_name, e.last_name, e.employee_number, tot.name as leave_type_name, tot.code as leave_type_code, tot.unit
    FROM time_off_allocations toa
    JOIN employees e ON toa.employee_id = e.id
    JOIN time_off_types tot ON toa.time_off_type_id = tot.id
    ${whereSql}
    ORDER BY toa.id DESC
    LIMIT $${paramCount} OFFSET $${paramCount + 1}
  `;

  const countSql = `SELECT COUNT(*) FROM time_off_allocations toa ${whereSql}`;

  const dataRes = await query(dataSql, [...params, limit, offset]);
  const countRes = await query(countSql, params);

  return {
    rows: dataRes.rows,
    total: parseInt(countRes.rows[0].count, 10),
  };
};

const findAllocationById = async (id) => {
  const sql = `
    SELECT toa.*, e.first_name, e.last_name, e.employee_number, tot.name as leave_type_name, tot.code as leave_type_code, tot.unit
    FROM time_off_allocations toa
    JOIN employees e ON toa.employee_id = e.id
    JOIN time_off_types tot ON toa.time_off_type_id = tot.id
    WHERE toa.id = $1
  `;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
};

const findActiveAllocation = async (employeeId, timeOffTypeId, date) => {
  const sql = `
    SELECT * FROM time_off_allocations
    WHERE employee_id = $1 AND time_off_type_id = $2 AND status = 'APPROVED'
      AND validity_start <= $3 AND validity_end >= $3
    ORDER BY validity_end ASC
    LIMIT 1
  `;
  const res = await query(sql, [employeeId, timeOffTypeId, date]);
  return res.rows[0] || null;
};

const createAllocation = async (data) => {
  const { employee_id, time_off_type_id, allocated_amount, validity_start, validity_end, status } = data;
  const sql = `
    INSERT INTO time_off_allocations (employee_id, time_off_type_id, allocated_amount, taken_amount, remaining_amount, validity_start, validity_end, status)
    VALUES ($1, $2, $3, 0, $3, $4, $5, $6)
    RETURNING *
  `;
  const res = await query(sql, [
    employee_id,
    time_off_type_id,
    allocated_amount,
    validity_start,
    validity_end,
    status || 'PENDING',
  ]);
  return res.rows[0];
};

const updateAllocationStatus = async (id, status) => {
  const res = await query(
    `UPDATE time_off_allocations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return res.rows[0];
};

const deductAllocationBalance = async (allocationId, duration) => {
  const sql = `
    UPDATE time_off_allocations
    SET taken_amount = taken_amount + $1,
        remaining_amount = remaining_amount - $1,
        updated_at = NOW()
    WHERE id = $2
    RETURNING *
  `;
  const res = await query(sql, [duration, allocationId]);
  return res.rows[0];
};

// --- Leave Requests ---
const findAllRequests = async ({ limit, offset, employee_id, status }) => {
  let whereClauses = [];
  let params = [];
  let paramCount = 1;

  if (employee_id) {
    whereClauses.push(`tor.employee_id = $${paramCount}`);
    params.push(employee_id);
    paramCount++;
  }

  if (status) {
    whereClauses.push(`tor.status = $${paramCount}`);
    params.push(status);
    paramCount++;
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const dataSql = `
    SELECT tor.*, e.first_name, e.last_name, e.employee_number, e.department,
           tot.name as leave_type_name, tot.code as leave_type_code, tot.unit
    FROM time_off_requests tor
    JOIN employees e ON tor.employee_id = e.id
    JOIN time_off_types tot ON tor.time_off_type_id = tot.id
    ${whereSql}
    ORDER BY tor.id DESC
    LIMIT $${paramCount} OFFSET $${paramCount + 1}
  `;

  const countSql = `SELECT COUNT(*) FROM time_off_requests tor ${whereSql}`;

  const dataRes = await query(dataSql, [...params, limit, offset]);
  const countRes = await query(countSql, params);

  return {
    rows: dataRes.rows,
    total: parseInt(countRes.rows[0].count, 10),
  };
};

const findRequestById = async (id) => {
  const sql = `
    SELECT tor.*, e.first_name, e.last_name, e.employee_number, e.department,
           tot.name as leave_type_name, tot.code as leave_type_code, tot.unit
    FROM time_off_requests tor
    JOIN employees e ON tor.employee_id = e.id
    JOIN time_off_types tot ON tor.time_off_type_id = tot.id
    WHERE tor.id = $1
  `;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
};

const createRequest = async (data) => {
  const { employee_id, time_off_type_id, allocation_id, start_date, end_date, duration, status } = data;
  const sql = `
    INSERT INTO time_off_requests (employee_id, time_off_type_id, allocation_id, start_date, end_date, duration, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const res = await query(sql, [
    employee_id,
    time_off_type_id,
    allocation_id || null,
    start_date,
    end_date,
    duration,
    status || 'PENDING',
  ]);
  return res.rows[0];
};

const updateRequestStatus = async (id, status) => {
  const res = await query(
    `UPDATE time_off_requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return res.rows[0];
};

module.exports = {
  findAllTypes,
  findTypeById,
  createType,
  updateType,
  deleteType,
  findAllAllocations,
  findAllocationById,
  findActiveAllocation,
  createAllocation,
  updateAllocationStatus,
  deductAllocationBalance,
  findAllRequests,
  findRequestById,
  createRequest,
  updateRequestStatus,
};
