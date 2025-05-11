const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

// Create Order (User Only)
router.post("/", authMiddleware, createOrder);

// Get All Orders (Admin Only)
router.get("/", authMiddleware, getOrders);

// Get Order By ID
router.get("/:id", authMiddleware, getOrderById);

// Update Order (Admin Only)
router.put("/:id", authMiddleware, updateOrder);

// Delete Order (Admin Only)
router.delete("/:id", authMiddleware, deleteOrder);

module.exports = router;
