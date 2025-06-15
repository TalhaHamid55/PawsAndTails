const express = require("express");
const router = express.Router();
const {
  createVeterinary,
  getVeterinaryById,
  updateVeterinary,
  deleteVeterinary,
  getVeterinariesWithFilters,
  getAllVeterinaries,
} = require("../controllers/veterinaryController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, createVeterinary);

router.get("/getAll", getAllVeterinaries);

router.get("/getAllVeterinarysByFilters", getVeterinariesWithFilters);

router.get("/:id", getVeterinaryById);

router.put("/:id", authMiddleware, updateVeterinary);

router.delete("/:id", authMiddleware, deleteVeterinary);

module.exports = router;
