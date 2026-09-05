const { query } = require('../../config/database');

const findAll = async ({ limit, offset, search, department, status }) => {
  let whereClauses = [];
  let params = [];
  let paramCount = 1;

  if (search) {
    whereClauses.push(`(e.first_name ILIKE $${paramCount} OR e.last_name ILIKE $${paramCount} OR e.email ILIKE $${paramCount} OR e.employee_number ILIKE $${paramCount})`);
    params.push(`%${search}%`);
    paramCount++;
  }

  if (department) {
    whereClauses.push(`e.department = $${paramCount}`);
    params.push(department);
    paramCount++;
  }

  if (status) {
    whereClauses.push(`e.status = $${paramCount}`);
    params.push(status);
    paramCount++;
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const dataSql = `
    SELECT e.*, ws.name as schedule_name, ws.weekly_hours
    FROM employees e
    LEFT JOIN working_schedules ws ON e.schedule_id = ws.id
    ${whereSql}
    ORDER BY e.id DESC
    LIMIT $${paramCount} OFFSET $${paramCount + 1}
  `;

  const countSql = `
    SELECT COUNT(*) FROM employees e ${whereSql}
  `;

  const dataRes = await query(dataSql, [...params, limit, offset]);
  const countRes = await query(countSql, params);

  return {
    rows: dataRes.rows,
    total: parseInt(countRes.rows[0].count, 10),
  };
};

const findById = async (id) => {
  const sql = `
    SELECT e.*, ws.name as schedule_name, ws.weekly_hours,
      (SELECT COUNT(*) FROM contracts c WHERE c.employee_id = e.id) as contract_count,
      (SELECT COUNT(*) FROM attendances a WHERE a.employee_id = e.id) as attendance_count,
      (SELECT COUNT(*) FROM time_off_requests tor WHERE tor.employee_id = e.id) as leave_request_count,
      (SELECT COUNT(*) FROM time_off_allocations toa WHERE toa.employee_id = e.id) as leave_allocation_count
    FROM employees e
    LEFT JOIN working_schedules ws ON e.schedule_id = ws.id
    WHERE e.id = $1
  `;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
};

const findByEmail = async (email) => {
  const res = await query('SELECT * FROM employees WHERE email = $1', [email]);
  return res.rows[0] || null;
};

const findByEmployeeNumber = async (employeeNumber) => {
  const res = await query('SELECT * FROM employees WHERE employee_number = $1', [employeeNumber]);
  return res.rows[0] || null;
};

const create = async (data) => {
  const { employee_number, first_name, last_name, email, phone, department, job_position, schedule_id, status } = data;
  const sql = `
    INSERT INTO employees (employee_number, first_name, last_name, email, phone, department, job_position, schedule_id, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  const res = await query(sql, [
    employee_number,
    first_name,
    last_name,
    email,
    phone || null,
    department,
    job_position,
    schedule_id || null,
    status || 'ACTIVE',
  ]);
  return res.rows[0];
};

const update = async (id, data) => {
  const { first_name, last_name, email, phone, department, job_position, schedule_id, status } = data;
  const sql = `
    UPDATE employees
    SET first_name = $1, last_name = $2, email = $3, phone = $4, department = $5,
        job_position = $6, schedule_id = $7, status = $8, updated_at = NOW()
    WHERE id = $9
    RETURNING *
  `;
  const res = await query(sql, [
    first_name,
    last_name,
    email,
    phone || null,
    department,
    job_position,
    schedule_id || null,
    status || 'ACTIVE',
    id,
  ]);
  return res.rows[0];
};

const remove = async (id) => {
  const res = await query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

module.exports = {
  findAll,
  findById,
  findByEmail,
  findByEmployeeNumber,
  create,
  update,
  remove,
};
