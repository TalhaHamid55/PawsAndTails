import { Link } from "react-router-dom";

const AIBreedDetection = () => {
  return (
    <div style={{ padding: "50px 25px" }}>
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
          <Link to="/breed-detector" target="_blank">
            <button>AI Breed Detection</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AIBreedDetection;
