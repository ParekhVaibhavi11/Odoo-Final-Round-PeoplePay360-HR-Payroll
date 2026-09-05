const { computeSalary } = require('../../utils/salaryCalculator');
const { query } = require('../../config/database');

/**
 * Computes single employee payslip by joining active contract, attendance logs, and ordered rules.
 */
const calculateEmployeePayslip = async (employeeId, periodStart, periodEnd, structureId, rules) => {
  const warnings = [];

  // 1. Fetch active contract for period
  const contractSql = `
    SELECT * FROM contracts
    WHERE employee_id = $1 AND status = 'ACTIVE'
      AND start_date <= $3 AND (end_date IS NULL OR end_date >= $2)
    ORDER BY start_date DESC LIMIT 1
  `;
  const contractRes = await query(contractSql, [employeeId, periodStart, periodEnd]);
  const contract = contractRes.rows[0];

  if (!contract) {
    warnings.push('Missing active contract for the selected pay period');
  }

  // 2. Fetch employee details
  const empRes = await query('SELECT * FROM employees WHERE id = $1', [employeeId]);
  const employee = empRes.rows[0];

  if (!employee) {
    warnings.push('Employee profile record not found');
  }

  // 3. Fetch attendance summary for period
  const attSql = `
    SELECT COUNT(*) as worked_days_count, SUM(worked_hours) as total_worked_hours
    FROM attendances
    WHERE employee_id = $1 AND date >= $2 AND date <= $3
  `;
  const attRes = await query(attSql, [employeeId, periodStart, periodEnd]);
  const workedDays = parseInt(attRes.rows[0].worked_days_count || 0, 10);
  const workedHours = parseFloat(attRes.rows[0].total_worked_hours || 0);

  const basicWage = contract ? parseFloat(contract.wage) : 0;

  // 4. Run dynamic rule sequence evaluation
  const calcResult = computeSalary(rules, basicWage);

  return {
    employee_id: employeeId,
    contract_id: contract ? contract.id : null,
    salary_structure_id: structureId,
    worked_days: workedDays,
    worked_hours: workedHours,
    basic_wage: calcResult.basic,
    gross_amount: calcResult.gross,
    deduction_amount: calcResult.deduction,
    net_amount: calcResult.net,
    lines: calcResult.lines,
    warnings,
  };
};

module.exports = {
  calculateEmployeePayslip,
};
