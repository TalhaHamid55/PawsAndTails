const Veterinary = require("../models/Veterinary");

exports.createVeterinary = async (req, res) => {
  try {
    const newVet = await Veterinary.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json({ veterinary: newVet });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllVeterinaries = async (req, res) => {
  try {
    const vets = await Veterinary.find();
    res.status(200).json({ veterinaries: vets });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getVeterinariesWithFilters = async (req, res) => {
  const { city, specialty, day, sort } = req.query;
  const filter = {};

  if (city) filter.city = city;
  if (specialty) filter.specialty = specialty;
  if (day) {
    const now = new Date();
    const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    switch (day) {
      case "Today":
        filter["availability.days"] = weekdayNames[now.getDay()];
        break;

      case "Tomorrow":
        filter["availability.days"] = weekdayNames[(now.getDay() + 1) % 7];
        break;

      case "This Week":
        filter["availability.days"] = {
          $in: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        };
        break;

      case "Weekends":
        filter["availability.days"] = { $in: ["Sat", "Sun"] };
        break;

      default:
        filter["availability.days"] = day;
    }
  }

  let sortOption = {};
  switch (sort) {
    case "topRated":
      sortOption.rating = -1;
      break;
    case "mostReviewed":
      sortOption.reviewsCount = -1;
      break;
    default:
      sortOption.createdAt = -1;
  }

  try {
    const vets = await Veterinary.find(filter).sort(sortOption);
    res.status(200).json({ veterinaries: vets });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getVeterinaryById = async (req, res) => {
  try {
    const vet = await Veterinary.findById(req.params.id);
    if (!vet) return res.status(404).json({ message: "Veterinary not found" });
    res.json({ veterinary: vet });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateVeterinary = async (req, res) => {
  try {
    const vet = await Veterinary.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ veterinary: vet });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteVeterinary = async (req, res) => {
  try {
    await Veterinary.findByIdAndDelete(req.params.id);
    res.json({ message: "Veterinary deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
