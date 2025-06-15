const mongoose = require("mongoose");

const adoptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    breed: { type: String, required: true },
    location: { type: String, required: true },
    age: { type: String, required: true },
    petType: { type: String, required: true },
    image: { type: String },
    available: { type: Boolean },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Adoption", adoptionSchema);
