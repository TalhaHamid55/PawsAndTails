const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderDetailsById,
  updateOrderStatus,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, createOrder);

router.get("/getAllOrders", authMiddleware, getOrders);

router.get("/getOrderDetailsById/:id", authMiddleware, getOrderDetailsById);

router.get("/:id", authMiddleware, getOrderById);

router.put("/:id", authMiddleware, updateOrder);

router.delete("/:id", authMiddleware, deleteOrder);

router.put("/:id/status", updateOrderStatus);

module.exports = router;
