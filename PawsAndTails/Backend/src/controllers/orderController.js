const Order = require("../models/Order");

// Create Order
exports.createOrder = async (req, res) => {
  const { products, totalAmount } = req.body;
  try {
    const newOrder = await Order.create({
      user: req.user.id,
      products,
      totalAmount,
    });
    res.status(201).json({ order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("products.product", "name price");
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Order By ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email")
      .populate("products.product", "name price");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Order
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Order
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
