const Adoption = require("../models/Adoption");
const moment = require("moment");
const { getAgeString } = require("../utils/common");

exports.createAdoption = async (req, res) => {
  const {
    name,
    description,
    petType,
    image,
    breed,
    age,
    location,
    contact,
    address,
    available,
    ownerName,
  } = req.body;

  try {
    const newAdoption = await Adoption.create({
      name,
      description,
      petType,
      image,
      breed,
      age,
      location,
      available,
      address,
      contact,
      ownerName,
      createdBy: req.user.id,
    });
    res.status(201).json({ adoption: newAdoption });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.find();
    res.json({ adoptions });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAdoptionsbyFilters = async (req, res) => {
  try {
    const { search, petType, breed, age, location, sort } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { ownerName: { $regex: search, $options: "i" } },
      ];
    }

    if (petType) {
      const petTypeArray = Array.isArray(petType)
        ? petType
        : petType.split(",").map((p) => p.trim());
      filter.petType = { $in: petTypeArray };
    }

    if (breed) {
      const breedArray = Array.isArray(breed)
        ? breed
        : breed.split(",").map((b) => b.trim());
      filter.breed = { $in: breedArray };
    }

    if (location) {
      const locationArray = Array.isArray(location)
        ? location
        : location.split(",").map((c) => c.trim());
      filter.location = { $in: locationArray };
    }

    if (age) {
      const ageRanges = Array.isArray(age)
        ? age
        : age.split(",").map((a) => a.trim());

      const dobFilters = ageRanges.map((range) => {
        const [minStr, maxStr] = range.split("-");
        const now = moment();

        let minDate = null;
        let maxDate = null;

        if (minStr.endsWith("d")) {
          minDate = now.clone().subtract(parseInt(minStr), "days");
        } else if (minStr.endsWith("y")) {
          minDate = now.clone().subtract(parseInt(minStr), "years");
        }

        if (maxStr.endsWith("d")) {
          maxDate = now.clone().subtract(parseInt(maxStr), "days");
        } else if (maxStr.endsWith("y")) {
          maxDate = now.clone().subtract(parseInt(maxStr), "years");
        }

        return {
          dob: {
            ...(maxDate && { $lte: maxDate.toDate() }),
            ...(minDate && { $gte: minDate.toDate() }),
          },
        };
      });

      if (dobFilters.length) {
        filter.$or = filter.$or || [];
        filter.$or.push(...dobFilters);
      }
    }

    let sortOption = {};
    switch (sort) {
      case "popular":
        sortOption.rating = -1;
        break;
      case "priceHighToLow":
        sortOption.price = -1;
        break;
      case "priceLowToHigh":
        sortOption.price = 1;
        break;
      case "newest":
        sortOption.createdAt = -1;
        break;
      default:
        sortOption.createdAt = -1;
    }

    const adoptions = await Adoption.find(filter).sort(sortOption);
    const enrichedAdoptions = adoptions.map((pet) => ({
      ...pet.toObject(),
      petAge: getAgeString(pet.age),
    }));

    res.status(200).json({ adoptions: enrichedAdoptions });
  } catch (error) {
    console.error("Error getting filtered adoptions:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAdoptionById = async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id);

    if (!adoption)
      return res.status(404).json({ message: "Adoption not found" });
    res.json({ adoption });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateAdoption = async (req, res) => {
  try {
    const updatedAdoption = await Adoption.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ adoption: updatedAdoption });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAdoption = async (req, res) => {
  try {
    await Adoption.findByIdAndDelete(req.params.id);
    res.json({ message: "Adoption deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
