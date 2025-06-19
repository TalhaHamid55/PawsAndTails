// const express = require("express");
// const multer = require("multer");
// const axios = require("axios");
// const FormData = require("form-data");
// const fs = require("fs");

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// router.post("/", upload.single("image"), async (req, res) => {
//   const form = new FormData();
//   form.append("image", fs.createReadStream(req.file.path));

//   try {
//     const resp = await axios.post("http://localhost:5001/predict", form, {
//       headers: form.getHeaders(),
//     });
//     res.json({ breed: resp.data.breed });
//   } catch (err) {
//     res.status(500).json({ error: "Prediction failed" });
//   }
// });

// module.exports = router;

const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");

const router = express.Router();
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString(
      "base64"
    )}`;

    const response = await axios.post(
      "https://hf.space/embed/Fahad0690/dog-breed-detector/api/predict/",
      {
        data: [base64Image],
      }
    );

    fs.unlinkSync(imagePath); // Clean up temp file

    const result = response.data?.data?.[0]?.label || "Unknown";
    res.json({ breed: result });
  } catch (error) {
    console.error("Breed prediction failed:", error.message);
    res.status(500).json({ message: "Prediction failed" });
  }
});

module.exports = router;
