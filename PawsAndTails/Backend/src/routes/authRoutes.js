const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserDetails,
  updateUser,
  getUserDetailsById,
  getUsersbyFilters,
  deleteUser,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getUserDetails", authMiddleware, getUserDetails);

router.get("/user/:id", authMiddleware, getUserDetailsById);

router.get("/getUsersByFilter", authMiddleware, getUsersbyFilters);

router.delete("/:id", authMiddleware, deleteUser);

router.put("/user/:id", authMiddleware, updateUser);

module.exports = router;
