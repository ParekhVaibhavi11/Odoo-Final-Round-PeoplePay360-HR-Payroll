const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const roleController = require('./role.controller');
const permissionController = require('./permission.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { ROLES } = require('../../config/constants');

router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.put('/users/:id/role', userController.updateUserRole);
router.get('/roles', roleController.getRoles);
router.get('/permissions', permissionController.getPermissions);

module.exports = router;
