const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserDetails,
  updateUser,
  getUserDetailsById,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getUserDetails", authMiddleware, getUserDetails);

router.get("/user/:id", authMiddleware, getUserDetailsById);

router.put("/user/:id", authMiddleware, updateUser);

module.exports = router;
