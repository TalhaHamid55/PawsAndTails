const Grooming = require("../models/Grooming");

exports.createGrooming = async (req, res) => {
  try {
    const newItem = await Grooming.create(req.body);
    res.status(201).json({ grooming: newItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getGroomingsWithFilters = async (req, res) => {
  const { city, services, minPrice, maxPrice, sort, availability } = req.query;
  const filter = {};

  if (city) filter.city = city;
  if (services) filter.services = { $in: services.split(",") };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseInt(minPrice);
    if (maxPrice) filter.price.$lte = parseInt(maxPrice);
  }

  if (availability) {
    const now = new Date();
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    switch (availability) {
      case "Today":
        filter["availability.days"] = weekdays[now.getDay()];
        break;
      case "Tomorrow":
        filter["availability.days"] = weekdays[(now.getDay() + 1) % 7];
        break;
      case "Weekends":
        filter["availability.days"] = { $in: ["Sat", "Sun"] };
        break;
      case "This Week":
        filter["availability.days"] = {
          $in: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        };
        break;
      default:
        filter["availability.days"] = availability;
    }
  }

  let sortOption = {};
  if (sort === "rating") sortOption.rating = -1;
  else if (sort === "price") sortOption.price = 1;
  else sortOption.createdAt = -1;

  try {
    const items = await Grooming.find(filter).sort(sortOption);
    res.status(200).json({ groomings: items });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllGroomings = async (req, res) => {
  try {
    const items = await Grooming.find();
    res.status(200).json({ groomings: items });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getGroomingById = async (req, res) => {
  try {
    const item = await Grooming.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json({ grooming: item });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateGrooming = async (req, res) => {
  try {
    const updated = await Grooming.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ grooming: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteGrooming = async (req, res) => {
  try {
    await Grooming.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
