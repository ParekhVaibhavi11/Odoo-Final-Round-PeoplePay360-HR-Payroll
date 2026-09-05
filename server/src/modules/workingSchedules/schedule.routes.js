const express = require('express');
const router = express.Router();
const scheduleController = require('./schedule.controller');
const scheduleValidation = require('./schedule.validation');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { ROLES } = require('../../config/constants');

router.use(authenticate);

router.get('/', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE), scheduleController.getSchedules);
router.get('/:id', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE), scheduleController.getSchedule);
router.post('/', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), validate(scheduleValidation.validateSchedule), scheduleController.createSchedule);
router.put('/:id', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), validate(scheduleValidation.validateSchedule), scheduleController.updateSchedule);
router.delete('/:id', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), scheduleController.deleteSchedule);

module.exports = router;
