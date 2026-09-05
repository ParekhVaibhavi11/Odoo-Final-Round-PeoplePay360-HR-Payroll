const { query } = require('../../config/database');

const getPayrollSummaryReport = async (startDate, endDate) => {
  const sql = `
    SELECT 
      e.department, 
      COUNT(DISTINCT e.id) as headcount,
      COALESCE(SUM(ps.basic_wage), COALESCE(SUM(c.wage), 0)) as total_basic,
      COALESCE(SUM(ps.gross_amount), COALESCE(SUM(c.wage * 1.15), 0)) as total_gross,
      COALESCE(SUM(ps.deduction_amount), COALESCE(SUM(c.wage * 0.10), 0)) as total_deductions,
      COALESCE(SUM(ps.net_amount), COALESCE(SUM(c.wage * 1.05), 0)) as total_net
    FROM employees e
    LEFT JOIN contracts c ON e.id = c.employee_id AND c.status = 'ACTIVE'
    LEFT JOIN payslips ps ON e.id = ps.employee_id
    LEFT JOIN payruns pr ON ps.payrun_id = pr.id AND (pr.period_start >= $1 AND pr.period_end <= $2)
    GROUP BY e.department
    ORDER BY e.department ASC
  `;
  const res = await query(sql, [startDate, endDate]);
  return res.rows;
};

const getEmployeeSalaryReport = async () => {
  const sql = `
    SELECT 
      e.id,
      e.employee_number,
      e.first_name,
      e.last_name,
      e.department,
      e.job_position,
      COALESCE(c.wage, 0) as basic_wage,
      COALESCE(c.wage * 1.15, 0) as gross_estimate,
      COALESCE(c.wage * 1.05, 0) as net_estimate,
      COALESCE(c.status, 'NO_CONTRACT') as contract_status
    FROM employees e
    LEFT JOIN contracts c ON e.id = c.employee_id AND c.status = 'ACTIVE'
    ORDER BY e.department ASC, e.last_name ASC
  `;
  const res = await query(sql);
  return res.rows;
};

const getAttendanceReport = async () => {
  const sql = `
    SELECT 
      e.department,
      COUNT(DISTINCT e.id) as headcount,
      COUNT(a.id) as total_entries,
      COUNT(CASE WHEN a.status = 'PRESENT' THEN 1 END) as present_days,
      COALESCE(SUM(a.worked_hours), 0) as total_worked_hours,
      COALESCE(SUM(a.overtime_hours), 0) as total_overtime_hours
    FROM employees e
    LEFT JOIN attendances a ON e.id = a.employee_id
    GROUP BY e.department
    ORDER BY e.department ASC
  `;
  const res = await query(sql);
  return res.rows;
};

module.exports = {
  getPayrollSummaryReport,
  getEmployeeSalaryReport,
  getAttendanceReport,
};
