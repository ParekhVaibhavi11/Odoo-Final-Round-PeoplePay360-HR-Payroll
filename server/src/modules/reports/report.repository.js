const { query } = require('../../config/database');

const getPayrollSummaryReport = async (startDate, endDate) => {
  const sql = `
    SELECT e.department, 
           COUNT(DISTINCT e.id) as headcount,
           COALESCE(SUM(ps.basic_wage), 0) as total_basic,
           COALESCE(SUM(ps.gross_amount), 0) as total_gross,
           COALESCE(SUM(ps.deduction_amount), 0) as total_deductions,
           COALESCE(SUM(ps.net_amount), 0) as total_net
    FROM employees e
    JOIN payslips ps ON e.id = ps.employee_id
    JOIN payruns pr ON ps.payrun_id = pr.id
    WHERE pr.period_start >= $1 AND pr.period_end <= $2
    GROUP BY e.department
  `;
  const res = await query(sql, [startDate, endDate]);
  return res.rows;
};

module.exports = {
  getPayrollSummaryReport,
};
