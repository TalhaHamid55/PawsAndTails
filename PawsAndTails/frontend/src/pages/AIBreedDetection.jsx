import React, { useState } from "react";

const AIBreedDetection = () => {
  const [image, setImage] = useState(null);
  const [breed, setBreed] = useState("");

  const handleUpload = async () => {
    debugger;
    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("http://localhost:5000/api/predict", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setBreed(data.breed); // Show the result
  };

  return (
    <div style={{ padding: "50px 25px" }}>
      {/* <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleUpload}>Detect Breed</button>
      {breed && <h2>Breed: {breed}</h2>} */}

      <div className="info-section">
        <h1>Paws & Tails: AI Breed Detection</h1>
        <p>
          Upload a photo of your dog and let our smart AI detect the breed using
          a powerful image recognition model trained on 70+ breeds.
        </p>
        <div className="info-columns">
          <div>
            <h3>🔍 Smart Detection</h3>
            <p>
              Our AI model uses deep learning to accurately identify the dog
              breed from any image.
            </p>
          </div>
          <div>
            <h3>⚡ Instant Results</h3>
            <p>
              Just upload the image, and in seconds, get a confidence score with
              the predicted breed.
            </p>
          </div>
          <div>
            <h3>📱 Works on All Devices</h3>
            <p>
              Use it on desktop, mobile, or tablet — no installation required.
            </p>
          </div>
        </div>

        <div className="action-btn">
          <a
            href="https://huggingface.co/spaces/Fahad0690/dog-breed-detector"
            target="_blank"
          >
            <button>AI Breed Detection</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AIBreedDetection;
