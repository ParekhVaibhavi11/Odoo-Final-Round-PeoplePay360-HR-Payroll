const express = require('express');
const router = express.Router();
const timeOffTypeController = require('./timeOffType.controller');
const allocationController = require('./allocation.controller');
const requestController = require('./request.controller');
const timeOffValidation = require('./timeOff.validation');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { ROLES } = require('../../config/constants');

router.use(authenticate);

// --- Time Off Types Routes ---
router.get('/types', timeOffTypeController.getTypes);
router.get('/types/:id', timeOffTypeController.getType);
router.post('/types', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), validate(timeOffValidation.validateTimeOffType), timeOffTypeController.createType);
router.put('/types/:id', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), validate(timeOffValidation.validateTimeOffType), timeOffTypeController.updateType);
router.delete('/types/:id', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), timeOffTypeController.deleteType);

// --- Allocations Routes ---
router.get('/allocations', allocationController.getAllocations);
router.get('/allocations/:id', allocationController.getAllocation);
router.post('/allocations', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), validate(timeOffValidation.validateAllocation), allocationController.createAllocation);
router.put('/allocations/:id/status', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), allocationController.updateAllocationStatus);

// --- Leave Requests Routes ---
router.get('/requests', requestController.getRequests);
router.get('/requests/:id', requestController.getRequest);
router.post('/requests', validate(timeOffValidation.validateRequest), requestController.createRequest);
router.put('/requests/:id/status', authorize(ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN), requestController.updateRequestStatus);

module.exports = router;
