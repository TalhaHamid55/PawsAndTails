const express = require("express");
const router = express.Router();
const {
  createGrooming,
  getGroomingById,
  updateGrooming,
  deleteGrooming,
  getGroomingsWithFilters,
  getAllGroomings,
} = require("../controllers/groomingController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, createGrooming);

router.get("/getAll", getAllGroomings);

router.get("/getAllGroomingsByFilters", getGroomingsWithFilters);

router.get("/:id", getGroomingById);

router.put("/:id", authMiddleware, updateGrooming);

router.delete("/:id", authMiddleware, deleteGrooming);

module.exports = router;
