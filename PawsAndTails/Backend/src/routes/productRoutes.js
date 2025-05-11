const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

// Create Product (Admin Only)
router.post("/", authMiddleware, createProduct);

// Get All Products
router.get("/", getProducts);

// Get Product By ID
router.get("/:id", getProductById);

// Update Product (Admin Only)
router.put("/:id", authMiddleware, updateProduct);

// Delete Product (Admin Only)
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
