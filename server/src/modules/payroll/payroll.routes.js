const express = require('express');
const router = express.Router();
const payrunController = require('./payrun.controller');
const payslipController = require('./payslip.controller');
const payrollValidation = require('./payroll.validation');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { ROLES } = require('../../config/constants');

router.use(authenticate);

// --- Payruns Endpoints ---
router.get('/payruns', authorize(ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), payrunController.getPayruns);
router.get('/payruns/:id', authorize(ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), payrunController.getPayrun);
router.post('/payruns', authorize(ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), validate(payrollValidation.validatePayrunWizard), payrunController.createAndComputePayrun);
router.put('/payruns/:id/validate', authorize(ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), payrunController.validatePayrun);
router.put('/payruns/:id/mark-paid', authorize(ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), payrunController.markPayrunPaid);
router.delete('/payruns/:id', authorize(ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), payrunController.deletePayrun);

// --- Payslips & PDF/Email Endpoints ---
router.get('/my-payslips', payslipController.getMyPayslips);
router.get('/payslips/:id', payrunController.getPayrun);
router.get('/payslips/:id/pdf', payslipController.downloadPayslipPdf);
router.post('/payslips/:id/email', authorize(ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), payslipController.sendPayslipEmail);
router.post('/payruns/:payrunId/send-payslips', authorize(ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), payslipController.sendBulkPayslipsEmail);

module.exports = router;
