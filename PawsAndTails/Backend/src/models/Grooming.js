const mongoose = require("mongoose");

const AvailabilitySchema = new mongoose.Schema({
  days: [String],
  startTime: String,
  endTime: String,
});

const GroomingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    services: [{ type: String }],
    price: { type: Number, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    city: { type: String, required: true },
    availability: AvailabilitySchema,
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Grooming", GroomingSchema);
