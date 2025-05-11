const express = require("express");
const router = express.Router();
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");

// Create Blog Post (Admin Only)
router.post("/", authMiddleware, createBlog);

// Get All Blog Posts
router.get("/", getBlogs);

// Get Blog Post By ID
router.get("/:id", getBlogById);

// Update Blog Post (Admin Only)
router.put("/:id", authMiddleware, updateBlog);

// Delete Blog Post (Admin Only)
router.delete("/:id", authMiddleware, deleteBlog);

module.exports = router;
