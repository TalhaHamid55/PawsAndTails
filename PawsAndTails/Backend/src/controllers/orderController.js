const Order = require("../models/Order");
const Product = require("../models/Product");
const { getCurrentActiveUserdetails } = require("../utils/common");

exports.createOrder = async (req, res) => {
  try {
    const newOrder = await Order.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json({ order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { search } = req.query;
    const user = await getCurrentActiveUserdetails(req);

    const baseFilter = user.role === "admin" ? {} : { userId: user.id };

    const searchFilter = {};

    if (search) {
      const regex = new RegExp(search, "i");
      const searchOr = [
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
        { address: { $regex: regex } },
        { city: { $regex: regex } },
        { state: { $regex: regex } },
        { zipCode: { $regex: regex } },
        { phoneNumber: { $regex: regex } },
        { status: { $regex: regex } },
      ];

      if (!isNaN(search)) {
        const numberSearch = parseFloat(search);
        searchOr.push(
          { totalAmount: numberSearch },
          { "items.quantity": numberSearch }
        );
      }

      searchFilter.$or = searchOr;
    }

    const filter = search ? { ...baseFilter, ...searchFilter } : baseFilter;

    const orders = await Order.find(filter).populate("items.productId");
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Status updated", order: updated });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getOrderDetailsById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.productId"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const products = order.items.map((item) => {
      const product = item.productId;
      return {
        _id: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        petType: product.petType,
        brand: product.brand,
        rating: product.rating,
        image: product.image,
        stock: product.stock,
        quantity: item.quantity,
      };
    });

    const response = {
      _id: order._id,
      userId: order.userId,
      totalAmount: order.totalAmount,
      status: order.status,
      address: order.address,
      firstName: order.firstName,
      lastName: order.lastName,
      city: order.city,
      state: order.state,
      phoneNumber: order.phoneNumber,
      zipCode: order.zipCode,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      products,
    };

    res.json({ order: response });
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({ message: "Error retrieving order", error });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.productId"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving order", error });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error });
  }
};
