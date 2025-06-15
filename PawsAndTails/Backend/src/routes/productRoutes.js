const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsbyFilters,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, createProduct);

router.get("/getAll", getProducts);

router.get("/getAllProductsByFilters", getProductsbyFilters);

router.get("/:id", getProductById);

router.put("/:id", authMiddleware, updateProduct);

router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
