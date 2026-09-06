const { query } = require('../../config/database');

// --- Payruns ---
const findAllPayruns = async ({ limit, offset, status }) => {
  let whereClauses = [];
  let params = [];
  let paramCount = 1;

  if (status) {
    whereClauses.push(`pr.status = $${paramCount}`);
    params.push(status);
    paramCount++;
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const dataSql = `
    SELECT pr.*, ss.name as structure_name, ss.code as structure_code,
           (SELECT COUNT(*) FROM payslips ps WHERE ps.payrun_id = pr.id) as payslip_count,
           (SELECT SUM(ps.net_amount) FROM payslips ps WHERE ps.payrun_id = pr.id) as total_net_amount
    FROM payruns pr
    LEFT JOIN salary_structures ss ON pr.salary_structure_id = ss.id
    ${whereSql}
    ORDER BY pr.id DESC
    LIMIT $${paramCount} OFFSET $${paramCount + 1}
  `;

  const countSql = `SELECT COUNT(*) FROM payruns pr ${whereSql}`;

  const dataRes = await query(dataSql, [...params, limit, offset]);
  const countRes = await query(countSql, params);

  return {
    rows: dataRes.rows,
    total: parseInt(countRes.rows[0].count, 10),
  };
};

const findPayrunById = async (id) => {
  const sql = `
    SELECT pr.*, ss.name as structure_name, ss.code as structure_code,
           (SELECT COUNT(*) FROM payslips ps WHERE ps.payrun_id = pr.id) as payslip_count,
           (SELECT SUM(ps.net_amount) FROM payslips ps WHERE ps.payrun_id = pr.id) as total_net_amount
    FROM payruns pr
    LEFT JOIN salary_structures ss ON pr.salary_structure_id = ss.id
    WHERE pr.id = $1
  `;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
};

const createPayrun = async (data) => {
  const { name, period_start, period_end, salary_structure_id, created_by } = data;
  const sql = `
    INSERT INTO payruns (name, period_start, period_end, salary_structure_id, status, created_by)
    VALUES ($1, $2, $3, $4, 'DRAFT', $5)
    RETURNING *
  `;
  const res = await query(sql, [name, period_start, period_end, salary_structure_id, created_by || null]);
  return res.rows[0];
};

const updatePayrunStatus = async (id, status) => {
  const res = await query('UPDATE payruns SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [
    status,
    id,
  ]);
  return res.rows[0];
};

const deletePayrun = async (id) => {
  const res = await query('DELETE FROM payruns WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

// --- Payslips ---
const findPayslipsByPayrun = async (payrunId) => {
  const sql = `
    SELECT ps.*, e.first_name, e.last_name, e.employee_number, e.department, e.email,
           ss.name as structure_name
    FROM payslips ps
    JOIN employees e ON ps.employee_id = e.id
    LEFT JOIN salary_structures ss ON ps.salary_structure_id = ss.id
    WHERE ps.payrun_id = $1
    ORDER BY ps.id ASC
  `;
  const res = await query(sql, [payrunId]);
  return res.rows;
};

const findPayslipById = async (id) => {
  const sql = `
    SELECT ps.*, e.first_name, e.last_name, e.employee_number, e.department, e.email, e.job_position,
           ss.name as structure_name, c.wage as contract_wage
    FROM payslips ps
    JOIN employees e ON ps.employee_id = e.id
    LEFT JOIN salary_structures ss ON ps.salary_structure_id = ss.id
    LEFT JOIN contracts c ON ps.contract_id = c.id
    WHERE ps.id = $1
  `;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
};

const findPayslipLines = async (payslipId) => {
  const sql = `SELECT * FROM payslip_lines WHERE payslip_id = $1 ORDER BY sequence ASC`;
  const res = await query(sql, [payslipId]);
  return res.rows;
};

const deletePayslipsByPayrun = async (payrunId) => {
  await query('DELETE FROM payslips WHERE payrun_id = $1', [payrunId]);
};

const createPayslip = async (data) => {
  const {
    payrun_id,
    employee_id,
    contract_id,
    salary_structure_id,
    worked_days,
    worked_hours,
    basic_wage,
    gross_amount,
    deduction_amount,
    net_amount,
    warnings,
    status,
  } = data;

  const sql = `
    INSERT INTO payslips (payrun_id, employee_id, contract_id, salary_structure_id, worked_days, worked_hours, basic_wage, gross_amount, deduction_amount, net_amount, warnings, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
  `;
  const res = await query(sql, [
    payrun_id,
    employee_id,
    contract_id,
    salary_structure_id,
    worked_days || 0,
    worked_hours || 0,
    basic_wage,
    gross_amount,
    deduction_amount,
    net_amount,
    JSON.stringify(warnings || []),
    status || 'DRAFT',
  ]);
  return res.rows[0];
};

const createPayslipLines = async (payslipId, lines) => {
  for (const line of lines) {
    const sql = `
      INSERT INTO payslip_lines (payslip_id, salary_rule_id, code, name, category, sequence, amount)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await query(sql, [
      payslipId,
      line.salary_rule_id,
      line.code,
      line.name,
      line.category,
      line.sequence,
      line.amount,
    ]);
  }
};

const updatePayslipsStatusByPayrun = async (payrunId, status) => {
  await query('UPDATE payslips SET status = $1, updated_at = NOW() WHERE payrun_id = $2', [status, payrunId]);
};

const findPayslipsByEmployee = async (employeeId) => {
  const sql = `
    SELECT ps.*, pr.name as payrun_name, pr.period_start, pr.period_end,
           ss.name as structure_name
    FROM payslips ps
    JOIN payruns pr ON ps.payrun_id = pr.id
    LEFT JOIN salary_structures ss ON ps.salary_structure_id = ss.id
    WHERE ps.employee_id = $1
    ORDER BY ps.id DESC
  `;
  const res = await query(sql, [employeeId]);
  return res.rows;
};

module.exports = {
  findAllPayruns,
  findPayrunById,
  createPayrun,
  updatePayrunStatus,
  deletePayrun,
  findPayslipsByPayrun,
  findPayslipById,
  findPayslipLines,
  findPayslipsByEmployee,
  deletePayslipsByPayrun,
  createPayslip,
  createPayslipLines,
  updatePayslipsStatusByPayrun,
};
