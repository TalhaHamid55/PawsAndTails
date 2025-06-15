const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  const form = new FormData();
  form.append("image", fs.createReadStream(req.file.path));

  try {
    const resp = await axios.post("http://localhost:5001/predict", form, {
      headers: form.getHeaders(),
    });
    res.json({ breed: resp.data.breed });
  } catch (err) {
    res.status(500).json({ error: "Prediction failed" });
  }
});

module.exports = router;
