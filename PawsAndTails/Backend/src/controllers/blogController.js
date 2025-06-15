const Blog = require("../models/Blog");

exports.createBlog = async (req, res) => {
  const { title, content, image, category } = req.body;
  try {
    const newBlog = await Blog.create({
      image,
      title,
      content,
      category,
      createdBy: req.user.id,
    });
    res.status(201).json({ blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBlogsByFilters = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (category) filter.category = category;

    const blogs = await Blog.find(filter);
    res.json({ blogs });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("createdBy", "username");
    res.json({ blogs });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

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

exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
