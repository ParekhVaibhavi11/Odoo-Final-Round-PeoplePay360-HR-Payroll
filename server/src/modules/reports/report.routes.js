const express = require('express');
const router = express.Router();
const reportController = require('./report.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { ROLES } = require('../../config/constants');

router.use(authenticate);

router.get('/payroll-summary', authorize(ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), reportController.getPayrollReport);

module.exports = router;
