const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { validateReview } = require("../middleware/validate");
const {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

router.post("/", protect, validateReview, createReview);
router.get("/", protect, getReviews);
router.get("/:id", protect, getReviewById);
router.put("/:id", protect, validateReview, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
