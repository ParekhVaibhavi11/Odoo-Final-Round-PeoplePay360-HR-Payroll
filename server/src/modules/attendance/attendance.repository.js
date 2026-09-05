const { query } = require('../../config/database');

const findAll = async ({ limit, offset, employee_id, startDate, endDate, status }) => {
  let whereClauses = [];
  let params = [];
  let paramCount = 1;

  if (employee_id) {
    whereClauses.push(`a.employee_id = $${paramCount}`);
    params.push(employee_id);
    paramCount++;
  }

  if (startDate) {
    whereClauses.push(`a.date >= $${paramCount}`);
    params.push(startDate);
    paramCount++;
  }

  if (endDate) {
    whereClauses.push(`a.date <= $${paramCount}`);
    params.push(endDate);
    paramCount++;
  }

  if (status) {
    whereClauses.push(`a.status = $${paramCount}`);
    params.push(status);
    paramCount++;
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const dataSql = `
    SELECT a.*, e.first_name, e.last_name, e.employee_number, e.department
    FROM attendances a
    JOIN employees e ON a.employee_id = e.id
    ${whereSql}
    ORDER BY a.date DESC, a.id DESC
    LIMIT $${paramCount} OFFSET $${paramCount + 1}
  `;

  const countSql = `SELECT COUNT(*) FROM attendances a ${whereSql}`;

  const dataRes = await query(dataSql, [...params, limit, offset]);
  const countRes = await query(countSql, params);

  return {
    rows: dataRes.rows,
    total: parseInt(countRes.rows[0].count, 10),
  };
};

const findById = async (id) => {
  const sql = `
    SELECT a.*, e.first_name, e.last_name, e.employee_number, e.department
    FROM attendances a
    JOIN employees e ON a.employee_id = e.id
    WHERE a.id = $1
  `;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
};

const findByEmployeeAndDate = async (employeeId, date) => {
  const sql = `SELECT * FROM attendances WHERE employee_id = $1 AND date = $2`;
  const res = await query(sql, [employeeId, date]);
  return res.rows[0] || null;
};

const createOrUpdateCheckIn = async (employeeId, date, checkInTime, status = 'PRESENT') => {
  const existing = await findByEmployeeAndDate(employeeId, date);
  if (existing) {
    const sql = `
      UPDATE attendances
      SET check_in = $1, status = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    const res = await query(sql, [checkInTime, status, existing.id]);
    return res.rows[0];
  } else {
    const sql = `
      INSERT INTO attendances (employee_id, date, check_in, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const res = await query(sql, [employeeId, date, checkInTime, status]);
    return res.rows[0];
  }
};

const updateCheckOut = async (attendanceId, checkOutTime, workedHours, overtimeHours) => {
  const sql = `
    UPDATE attendances
    SET check_out = $1, worked_hours = $2, overtime_hours = $3, updated_at = NOW()
    WHERE id = $4
    RETURNING *
  `;
  const res = await query(sql, [checkOutTime, workedHours, overtimeHours, attendanceId]);
  return res.rows[0];
};

const manualCorrection = async (id, data) => {
  const { check_in, check_out, worked_hours, overtime_hours, status, notes } = data;
  const sql = `
    UPDATE attendances
    SET check_in = $1, check_out = $2, worked_hours = $3, overtime_hours = $4,
        status = $5, notes = $6, updated_at = NOW()
    WHERE id = $7
    RETURNING *
  `;
  const res = await query(sql, [check_in, check_out, worked_hours, overtime_hours, status || 'MANUAL_EDIT', notes || null, id]);
  return res.rows[0];
};

const remove = async (id) => {
  const res = await query('DELETE FROM attendances WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

module.exports = {
  findAll,
  findById,
  findByEmployeeAndDate,
  createOrUpdateCheckIn,
  updateCheckOut,
  manualCorrection,
  remove,
};
