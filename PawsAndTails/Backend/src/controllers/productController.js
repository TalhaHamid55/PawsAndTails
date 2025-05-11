const Product = require("../models/Product");

// Create Product
exports.createProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      createdBy: req.user.id,
    });
    res.status(201).json({ product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Product By ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Product
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

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
