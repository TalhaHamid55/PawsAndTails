const mongoose = require("mongoose");

const AvailabilitySchema = new mongoose.Schema({
  days: [String],
  startTime: String,
  endTime: String,
});

const VeterinarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    city: { type: String, required: true },
    image: { type: String },
    availability: AvailabilitySchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Veterinary", VeterinarySchema);
