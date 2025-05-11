const Blog = require("../models/Blog");

// Create Blog Post
exports.createBlog = async (req, res) => {
  const { title, content } = req.body;
  try {
    const newBlog = await Blog.create({
      title,
      content,
      createdBy: req.user.id,
    });
    res.status(201).json({ blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Blog Posts
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("createdBy", "username");
    res.json({ blogs });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Blog Post By ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "createdBy",
      "username"
    );
    if (!blog) return res.status(404).json({ message: "Blog post not found" });
    res.json({ blog });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Blog Post
exports.updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Blog Post
exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
