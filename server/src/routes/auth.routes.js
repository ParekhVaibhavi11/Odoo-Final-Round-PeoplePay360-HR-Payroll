const express = require("express");

const authController = require("../controllers/auth.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");

const {
  loginSchema,
  changePasswordSchema,
} = require("../validations/auth.validation");

const router = express.Router();

router.post(
  "/login",
  validate(loginSchema),
  authController.login
);

router.post(
  "/refresh",
  authController.refresh
);

router.get(
  "/me",
  authenticate,
  authController.getCurrentUser
);

router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

router.post(
  "/logout",
  authController.logout
);

module.exports = router;