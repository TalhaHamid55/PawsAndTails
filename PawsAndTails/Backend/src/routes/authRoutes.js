const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  updateUser,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get User (Protected)
router.get("/user/:id", authMiddleware, getUser);

// Update User (Protected)
router.put("/user/:id", authMiddleware, updateUser);

module.exports = router;
