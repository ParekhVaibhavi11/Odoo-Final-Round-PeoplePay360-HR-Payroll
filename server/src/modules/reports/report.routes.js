const express = require('express');
const router = express.Router();
const reportController = require('./report.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { ROLES } = require('../../config/constants');

router.use(authenticate);
router.use(authorize(ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN));

router.get('/payroll-summary', reportController.getPayrollReport);
router.get('/employee-salary', reportController.getEmployeeSalaryReport);
router.get('/attendance-summary', reportController.getAttendanceReport);

module.exports = router;
