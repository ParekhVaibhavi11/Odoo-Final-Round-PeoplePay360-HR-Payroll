const { query } = require('../../config/database');

const getLiveMetrics = async ({ department, employeeType }) => {
  // KPI 1: Net Salary Paid & Payslip Count
  const salarySql = `
    SELECT COALESCE(SUM(net_amount), 0) as total_net_paid,
           COUNT(*) as payslips_generated,
           COALESCE(AVG(net_amount), 0) as avg_salary
    FROM payslips WHERE status = 'PAID'
  `;
  const salaryRes = await query(salarySql);

  // KPI 2: Approved Time Off Days
  const timeOffSql = `
    SELECT COALESCE(SUM(duration), 0) as approved_leave_days
    FROM time_off_requests WHERE status = 'APPROVED'
  `;
  const timeOffRes = await query(timeOffSql);

  // KPI 3: Attendance Health % (Present vs Total logged entries)
  const attSql = `
    SELECT COUNT(*) as total_entries,
           COUNT(CASE WHEN status = 'PRESENT' THEN 1 END) as present_entries
    FROM attendances
  `;
  const attRes = await query(attSql);
  const totalAtt = parseInt(attRes.rows[0].total_entries || 0, 10);
  const presentAtt = parseInt(attRes.rows[0].present_entries || 0, 10);
  const attendanceHealth = totalAtt > 0 ? parseFloat(((presentAtt / totalAtt) * 100).toFixed(1)) : 100;

  // Chart 1: Salary Cost by Department
  const deptCostSql = `
    SELECT e.department, COALESCE(SUM(ps.net_amount), 0) as total_salary, COUNT(e.id) as headcount
    FROM employees e
    LEFT JOIN payslips ps ON e.id = ps.employee_id AND ps.status = 'PAID'
    GROUP BY e.department
  `;
  const deptCostRes = await query(deptCostSql);

  // Chart 2: Monthly Net Salary Trends
  const trendSql = `
    SELECT TO_CHAR(pr.period_start, 'Mon YYYY') as month_label,
           COALESCE(SUM(ps.net_amount), 0) as total_paid
    FROM payruns pr
    JOIN payslips ps ON pr.id = ps.payrun_id
    WHERE pr.status = 'PAID'
    GROUP BY pr.period_start
    ORDER BY pr.period_start ASC
    LIMIT 6
  `;
  const trendRes = await query(trendSql);

  // Operational Warnings & Alerts
  const warnings = [];

  // Check unassigned contracts
  const unassignedRes = await query(
    'SELECT COUNT(*) FROM employees e LEFT JOIN contracts c ON e.id = c.employee_id AND c.status = $1 WHERE c.id IS NULL',
    ['ACTIVE']
  );
  const unassignedCount = parseInt(unassignedRes.rows[0].count, 10);
  if (unassignedCount > 0) {
    warnings.push(`${unassignedCount} active employees have no active contract assigned`);
  }

  // Check pending leave requests
  const pendingLeaveRes = await query("SELECT COUNT(*) FROM time_off_requests WHERE status = 'PENDING'");
  const pendingLeaveCount = parseInt(pendingLeaveRes.rows[0].count, 10);
  if (pendingLeaveCount > 0) {
    warnings.push(`${pendingLeaveCount} leave requests are awaiting manager approval`);
  }

  return {
    kpis: {
      totalNetPaid: parseFloat(salaryRes.rows[0].total_net_paid),
      payslipsGenerated: parseInt(salaryRes.rows[0].payslips_generated, 10),
      avgSalary: parseFloat(salaryRes.rows[0].avg_salary),
      approvedLeaveDays: parseFloat(timeOffRes.rows[0].approved_leave_days),
      attendanceHealth,
    },
    departmentCosts: deptCostRes.rows,
    salaryTrends: trendRes.rows,
    operationalAlerts: warnings,
  };
};

module.exports = {
  getLiveMetrics,
};
