const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentsWithFilters,
  getAllAppointments,
} = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, createAppointment);

router.get("/getAll", getAllAppointments);

router.get("/getAllAppointmentsByFilters", getAppointmentsWithFilters);

router.get("/:id", getAppointmentById);

router.put("/:id", authMiddleware, updateAppointment);

router.delete("/:id", authMiddleware, deleteAppointment);

router.put("/:id/status", updateAppointment);

module.exports = router;
