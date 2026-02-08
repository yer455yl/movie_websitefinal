const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { searchMovieOMDB } = require("../controllers/externalController");

router.get("/omdb", protect, searchMovieOMDB);

module.exports = router;