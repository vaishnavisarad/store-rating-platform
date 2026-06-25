const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  ratingValidation,
  validate,
} = require("../middleware/validationMiddleware");

router.use(authMiddleware);

router.get("/stores", userController.getStores);

router.post("/ratings", 
     ratingValidation,
  validate,userController.submitRating);

router.put("/ratings/:storeId", userController.updateRating);

router.get(
  "/owner/dashboard",
  roleMiddleware("STORE_OWNER"),
  userController.getOwnerDashboard
);

router.get(
  "/owner/ratings",
  roleMiddleware("STORE_OWNER"),
  userController.getStoreRatings
);

module.exports = router;