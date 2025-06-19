require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const blogRoutes = require("./routes/blogRoutes");
const veterinaryRoutes = require("./routes/veterinaryRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");
const groomingRoutes = require("./routes/groomingRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const predictRoute = require("./routes/predict");

const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// These are important!
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Connect Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/veterinaries", veterinaryRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/groomings", groomingRoutes);
app.use("/api/appointments", appointmentRoutes);

// ML endPoint
app.use("/api/predict", predictRoute);

app.use("/api/upload", require("./routes/uploadRoutes"));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
