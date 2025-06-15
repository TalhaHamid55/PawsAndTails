const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    stock,
    brand,
    petType,
    image,
    rating,
  } = req.body;

  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      brand,
      petType,
      image,
      rating,
      createdBy: req.user.id,
    });
    res.status(201).json({ product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProductsbyFilters = async (req, res) => {
  try {
    const {
      search,
      brand,
      category,
      petType,
      rating,
      sort,
      minPrice,
      maxPrice,
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (brand) {
      const brandArray = Array.isArray(brand)
        ? brand
        : brand.split(",").map((b) => b.trim());
      filter.brand = { $in: brandArray };
    }

    if (category) {
      const categoryArray = Array.isArray(category)
        ? category
        : category.split(",").map((c) => c.trim());
      filter.category = { $in: categoryArray };
    }

    if (petType) {
      const petTypeArray = Array.isArray(petType)
        ? petType
        : petType.split(",").map((p) => p.trim());
      filter.petType = { $in: petTypeArray };
    }

    if (rating && !isNaN(Number(rating))) {
      filter.rating = { $gte: Number(rating) };
    }

    if ((minPrice && !isNaN(minPrice)) || (maxPrice && !isNaN(maxPrice))) {
      filter.price = {};
      if (minPrice && !isNaN(minPrice)) filter.price.$gte = Number(minPrice);
      if (maxPrice && !isNaN(maxPrice)) filter.price.$lte = Number(maxPrice);
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

    const products = await Product.find(filter).sort(sortOption);

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error getting filtered products:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProductsbyFiltersWithSingleValue = async (req, res) => {
  try {
    const {
      search,
      brand,
      category,
      petType,
      rating,
      sort,
      minPrice,
      maxPrice,
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (brand) filter.brand = brand;
    if (category) filter.category = category;
    if (petType) filter.petType = petType;

    if (rating && !isNaN(Number(rating))) {
      filter.rating = { $gte: Number(rating) };
    }

    if ((minPrice && !isNaN(minPrice)) || (maxPrice && !isNaN(maxPrice))) {
      filter.price = {};
      if (minPrice && !isNaN(minPrice)) filter.price.$gte = Number(minPrice);
      if (maxPrice && !isNaN(maxPrice)) filter.price.$lte = Number(maxPrice);
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

    const products = await Product.find(filter).sort(sortOption);

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error getting filtered products:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
