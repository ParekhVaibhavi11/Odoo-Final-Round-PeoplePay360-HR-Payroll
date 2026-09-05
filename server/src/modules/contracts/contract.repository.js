const { query } = require('../../config/database');

const findAll = async ({ limit, offset, employee_id, status }) => {
  let whereClauses = [];
  let params = [];
  let paramCount = 1;

  if (employee_id) {
    whereClauses.push(`c.employee_id = $${paramCount}`);
    params.push(employee_id);
    paramCount++;
  }

  if (status) {
    whereClauses.push(`c.status = $${paramCount}`);
    params.push(status);
    paramCount++;
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const dataSql = `
    SELECT c.*, 
           e.first_name, e.last_name, e.employee_number,
           ss.name as structure_name, ss.code as structure_code
    FROM contracts c
    JOIN employees e ON c.employee_id = e.id
    LEFT JOIN salary_structures ss ON c.salary_structure_id = ss.id
    ${whereSql}
    ORDER BY c.id DESC
    LIMIT $${paramCount} OFFSET $${paramCount + 1}
  `;

  const countSql = `SELECT COUNT(*) FROM contracts c ${whereSql}`;

  const dataRes = await query(dataSql, [...params, limit, offset]);
  const countRes = await query(countSql, params);

  return {
    rows: dataRes.rows,
    total: parseInt(countRes.rows[0].count, 10),
  };
};

const findById = async (id) => {
  const sql = `
    SELECT c.*, 
           e.first_name, e.last_name, e.employee_number,
           ss.name as structure_name, ss.code as structure_code
    FROM contracts c
    JOIN employees e ON c.employee_id = e.id
    LEFT JOIN salary_structures ss ON c.salary_structure_id = ss.id
    WHERE c.id = $1
  `;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
};

const findActiveContractForPeriod = async (employeeId, periodStart, periodEnd) => {
  const sql = `
    SELECT c.*, ss.id as structure_id
    FROM contracts c
    LEFT JOIN salary_structures ss ON c.salary_structure_id = ss.id
    WHERE c.employee_id = $1 
      AND c.status = 'ACTIVE'
      AND c.start_date <= $3
      AND (c.end_date IS NULL OR c.end_date >= $2)
    ORDER BY c.start_date DESC
    LIMIT 1
  `;
  const res = await query(sql, [employeeId, periodStart, periodEnd]);
  return res.rows[0] || null;
};

const findOverlappingActiveContracts = async (employeeId, startDate, endDate, excludeId = null) => {
  let sql = `
    SELECT * FROM contracts
    WHERE employee_id = $1 AND status = 'ACTIVE'
      AND start_date <= COALESCE($3, '9999-12-31'::date)
      AND (end_date IS NULL OR end_date >= $2)
  `;
  const params = [employeeId, startDate, endDate];

  if (excludeId) {
    sql += ` AND id != $4`;
    params.push(excludeId);
  }

  const res = await query(sql, params);
  return res.rows;
};

const create = async (data) => {
  const { employee_id, start_date, end_date, wage, salary_structure_id, department, job_position, status } = data;
  const sql = `
    INSERT INTO contracts (employee_id, start_date, end_date, wage, salary_structure_id, department, job_position, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  const res = await query(sql, [
    employee_id,
    start_date,
    end_date || null,
    wage,
    salary_structure_id || null,
    department,
    job_position,
    status || 'ACTIVE',
  ]);
  return res.rows[0];
};

const update = async (id, data) => {
  const { start_date, end_date, wage, salary_structure_id, department, job_position, status } = data;
  const sql = `
    UPDATE contracts
    SET start_date = $1, end_date = $2, wage = $3, salary_structure_id = $4,
        department = $5, job_position = $6, status = $7, updated_at = NOW()
    WHERE id = $8
    RETURNING *
  `;
  const res = await query(sql, [
    start_date,
    end_date || null,
    wage,
    salary_structure_id || null,
    department,
    job_position,
    status,
    id,
  ]);
  return res.rows[0];
};

const remove = async (id) => {
  const res = await query('DELETE FROM contracts WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

module.exports = {
  findAll,
  findById,
  findActiveContractForPeriod,
  findOverlappingActiveContracts,
  create,
  update,
  remove,
};
