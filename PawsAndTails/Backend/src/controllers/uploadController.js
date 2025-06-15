const path = require("path");

exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imagePath = `/uploads/${req.file.filename}`;
  res.status(200).json({ imagePath });
};
