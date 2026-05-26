const express = require("express");
const router = express.Router();

const {
  register,
  login
} = require("../controllers/authController");

router.post("/register", register); // POST /auth/register
router.post("/login", login);       // POST /auth/login

module.exports = router;