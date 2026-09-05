const express = require('express');
const router = express.Router();
const attendanceController = require('./attendance.controller');
const attendanceValidation = require('./attendance.validation');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { ROLES } = require('../../config/constants');

router.use(authenticate);

router.get('/', attendanceController.getAttendances);
router.post('/check-in', validate(attendanceValidation.validateCheckIn), attendanceController.checkIn);
router.post('/check-out', validate(attendanceValidation.validateCheckOut), attendanceController.checkOut);
router.put('/:id', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), validate(attendanceValidation.validateManualCorrection), attendanceController.manualCorrection);
router.delete('/:id', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), attendanceController.deleteAttendance);

module.exports = router;
