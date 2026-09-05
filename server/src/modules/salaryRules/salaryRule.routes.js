const express = require('express');
const router = express.Router();
const ruleController = require('./salaryRule.controller');
const ruleValidation = require('./salaryRule.validation');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { ROLES } = require('../../config/constants');

router.use(authenticate);

router.get('/structure/:structureId', authorize(ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), ruleController.getRulesByStructure);
router.get('/:id', authorize(ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), ruleController.getRule);
router.post('/', authorize(ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), validate(ruleValidation.validateSalaryRule), ruleController.createRule);
router.put('/:id', authorize(ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), validate(ruleValidation.validateSalaryRule), ruleController.updateRule);
router.delete('/:id', authorize(ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), ruleController.deleteRule);

module.exports = router;
