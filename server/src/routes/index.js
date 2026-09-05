const express = require('express');
const router = express.Router();

const authRoutes = require('../modules/auth/auth.routes');
const employeeRoutes = require('../modules/employees/employee.routes');
const contractRoutes = require('../modules/contracts/contract.routes');
const scheduleRoutes = require('../modules/workingSchedules/schedule.routes');
const attendanceRoutes = require('../modules/attendance/attendance.routes');
const timeOffRoutes = require('../modules/timeOff/timeOff.routes');
const salaryStructureRoutes = require('../modules/salaryStructures/salaryStructure.routes');
const salaryRuleRoutes = require('../modules/salaryRules/salaryRule.routes');
const payrollRoutes = require('../modules/payroll/payroll.routes');
const dashboardRoutes = require('../modules/dashboard/dashboard.routes');
const reportRoutes = require('../modules/reports/report.routes');
const notificationRoutes = require('../modules/notifications/notification.routes');
const adminRoutes = require('../modules/admin/admin.routes');

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/contracts', contractRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/time-off', timeOffRoutes);
router.use('/salary-structures', salaryStructureRoutes);
router.use('/salary-rules', salaryRuleRoutes);
router.use('/payroll', payrollRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
