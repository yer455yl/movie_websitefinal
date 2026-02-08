const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { validateMovie } = require("../middleware/validate");
const {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");

router.post("/", protect, validateMovie, createMovie);
router.put("/:id", protect, validateMovie, updateMovie);

router.get("/", protect, getMovies);
router.get("/:id", protect, getMovieById);
router.delete("/:id", protect, deleteMovie);

module.exports = router;