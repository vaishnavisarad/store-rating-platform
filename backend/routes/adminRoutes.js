const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const {
  registerValidation,
  validate,
} = require("../middleware/validationMiddleware");




// Dashboard
router.get("/dashboard", adminController.getDashboard);

// Create User
router.post("/users",
     registerValidation,
  validate, adminController.createUser);

// Create Store
router.post("/stores", adminController.createStore);

// Get Users
router.get("/users", adminController.getUsers);

// Get User Details
router.get("/users/:id", adminController.getUserById);

// Get Stores
router.get("/stores", adminController.getStores);

module.exports = router;