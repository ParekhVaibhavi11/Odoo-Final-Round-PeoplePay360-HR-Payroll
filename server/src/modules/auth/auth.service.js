const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authValidation = require('./auth.validation');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');

router.post('/login', validate(authValidation.validateLogin), authController.login);
router.get('/me', authenticate, authController.getMe);
router.post('/forgot-password', validate(authValidation.validateForgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.validateResetPassword), authController.resetPassword);

module.exports = router;
