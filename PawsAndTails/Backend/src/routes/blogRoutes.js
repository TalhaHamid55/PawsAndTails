const express = require("express");
const router = express.Router();
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByFilters,
} = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, createBlog);

router.get("/getAll", getBlogs);

router.get("/getAllBlogsByFilters", getBlogsByFilters);

router.get("/:id", getBlogById);

router.put("/:id", authMiddleware, updateBlog);

router.delete("/:id", authMiddleware, deleteBlog);

module.exports = router;
