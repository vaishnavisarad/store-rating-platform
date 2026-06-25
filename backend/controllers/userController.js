const userModel = require("../models/userModel");

/**
 * Get All Stores
 */
exports.getStores = async (req, res) => {
  try {
    const stores = await userModel.getStores(
      req.user.id,
      req.query
    );

    res.status(200).json({
      success: true,
      stores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Submit Rating
 */
exports.submitRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const existingRating =
      await userModel.getUserRating(
        req.user.id,
        store_id
      );

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message:
          "You have already rated this store",
      });
    }

    await userModel.submitRating({
      user_id: req.user.id,
      store_id,
      rating,
    });

    res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Rating
 */
exports.updateRating = async (req, res) => {
  try {
    const { rating } = req.body;

    const { storeId } = req.params;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const existingRating =
      await userModel.getUserRating(
        req.user.id,
        storeId
      );

    if (!existingRating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }

    await userModel.updateRating(
      req.user.id,
      storeId,
      rating
    );

    res.status(200).json({
      success: true,
      message: "Rating updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * Store Owner Dashboard
 * Average Rating + Store Info
 */
exports.getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const dashboard =
      await userModel.getAverageRating(ownerId);

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message:
          "No store assigned to this owner",
      });
    }

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Users Who Submitted Ratings
 */
exports.getStoreRatings = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const ratings =
      await userModel.getStoreRatings(ownerId);

    res.status(200).json({
      success: true,
      total: ratings.length,
      data: ratings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};