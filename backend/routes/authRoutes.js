const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerValidation,
  validate,
} = require("../middleware/validationMiddleware");

router.post("/login", authController.login);

router.post("/register",
    registerValidation,
    validate,
    authController.register);

router.put(
  "/change-password",
  authMiddleware,
  authController.changePassword
);

router.post(
  "/logout",
  authMiddleware,
  authController.logout
);

router.get(
  "/profile",
  authMiddleware,
  authController.getProfile
);

module.exports = router;