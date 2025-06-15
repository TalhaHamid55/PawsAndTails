const Appointment = require("../models/Appointment");
const { getCurrentActiveUserdetails } = require("../utils/common");

exports.createAppointment = async (req, res) => {
  try {
    const newApp = await Appointment.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json({ appointment: newApp });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const apps = await Appointment.find();
    res.status(200).json({ appointments: apps });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAppointmentsWithFilters = async (req, res) => {
  const { search, city, service, category } = req.query;
  const user = await getCurrentActiveUserdetails(req);

  const filter = {};

  if (user.role !== "admin") {
    filter.userId = user.id;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (city) filter.city = city;
  if (service) filter.service = service;
  if (category) filter.category = category;

  try {
    const apps = await Appointment.find(filter);
    res.status(200).json({ appointments: apps });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Status updated", appointment: updated });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.json({ appointment: appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json({ appointment: appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
