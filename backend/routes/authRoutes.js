const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { validateRegister } = require("../middleware/validate");

router.post("/register", validateRegister, register);
router.post("/login", validateRegister, login);

module.exports = router;