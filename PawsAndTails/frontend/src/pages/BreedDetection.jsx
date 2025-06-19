import { useState, useRef } from "react";
import axios from "axios";
import { Button, Image } from "antd";

const BreedDetection = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [breed, setBreed] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null); // Create a ref for the file input

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setBreed("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:5600/predict", formData);
      setBreed(res.data.breed);
    } catch (err) {
      console.error("Error during prediction:", err);
      setBreed("Error detecting breed.");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setBreed("");
    if (inputRef.current) {
      inputRef.current.value = ""; // Clear the file input manually
    }
  };

  return (
    <div style={{ padding: "50px 25px" }}>
      <div className="info-section">
        <h2>Dog Breed Detector</h2>
        <br />
        <div className="upload-section">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={inputRef}
          />
          <Button
            onClick={handleUpload}
            block
            type="primary"
            disabled={!file || loading}
            style={{ marginTop: "10px" }}
          >
            {loading ? "Detecting..." : "Detect"}
          </Button>
          {file && (
            <Button
              onClick={handleRemove}
              block
              type="default"
              style={{ marginTop: "10px" }}
            >
              Remove
            </Button>
          )}
          {preview && (
            <Image
              src={preview}
              alt="Preview"
              style={{ marginTop: 20, maxWidth: 300 }}
            />
          )}
        </div>

        {breed && !loading && (
          <p style={{ marginTop: 20, fontSize: "18px" }}>Breed: {breed}</p>
        )}
      </div>
    </div>
  );
};

export default BreedDetection;
