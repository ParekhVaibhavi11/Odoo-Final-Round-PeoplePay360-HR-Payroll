const express = require('express');
const router = express.Router();
const structureController = require('./salaryStructure.controller');
const structureValidation = require('./salaryStructure.validation');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { ROLES } = require('../../config/constants');

router.use(authenticate);

router.get('/', authorize(ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), structureController.getStructures);
router.get('/:id', authorize(ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), structureController.getStructure);
router.post('/', authorize(ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), validate(structureValidation.validateSalaryStructure), structureController.createStructure);
router.put('/:id', authorize(ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), validate(structureValidation.validateSalaryStructure), structureController.updateStructure);
router.delete('/:id', authorize(ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), structureController.deleteStructure);

module.exports = router;
