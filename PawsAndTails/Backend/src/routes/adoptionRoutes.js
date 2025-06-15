const express = require("express");
const router = express.Router();
const {
  createAdoption,
  getAdoptions,
  getAdoptionById,
  updateAdoption,
  deleteAdoption,
  getAdoptionsbyFilters,
} = require("../controllers/AdoptionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, createAdoption);

router.get("/getAll", getAdoptions);

router.get("/getAllAdoptionsByFilters", getAdoptionsbyFilters);

router.get("/:id", getAdoptionById);

router.put("/:id", authMiddleware, updateAdoption);

router.delete("/:id", authMiddleware, deleteAdoption);

module.exports = router;
