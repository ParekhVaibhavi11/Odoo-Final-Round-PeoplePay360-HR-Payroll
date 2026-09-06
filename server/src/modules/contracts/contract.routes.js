const express = require('express');
const router = express.Router();
const contractController = require('./contract.controller');
const contractValidation = require('./contract.validation');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { ROLES } = require('../../config/constants');

router.use(authenticate);

router.get('/', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), contractController.getContracts);
router.get('/:id', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE), contractController.getContract);
router.post('/', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), validate(contractValidation.validateContract), contractController.createContract);
router.put('/:id', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), validate(contractValidation.validateContract), contractController.updateContract);
router.delete('/:id', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), contractController.deleteContract);

module.exports = router;
