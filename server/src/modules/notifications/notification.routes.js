const express = require('express');
const router = express.Router();
const notifController = require('./notification.controller');
const { authenticate } = require('../../middleware/auth.middleware');

router.use(authenticate);

router.get('/', notifController.getMyNotifications);
router.put('/read-all', notifController.markAllAsRead);
router.put('/:id/read', notifController.markAsRead);

module.exports = router;
