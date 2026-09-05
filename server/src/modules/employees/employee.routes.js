const express = require('express');
const router = express.Router();
const employeeController = require('./employee.controller');
const employeeValidation = require('./employee.validation');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { ROLES } = require('../../config/constants');

router.use(authenticate);

router.get('/', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), employeeController.getEmployees);
router.get('/:id', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE), employeeController.getEmployee);
router.post('/', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), validate(employeeValidation.validateEmployee), employeeController.createEmployee);
router.put('/:id', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), validate(employeeValidation.validateEmployee), employeeController.updateEmployee);
router.delete('/:id', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), employeeController.deleteEmployee);

module.exports = router;
