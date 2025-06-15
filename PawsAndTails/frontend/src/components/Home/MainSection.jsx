import { Link } from "react-router-dom";
import mainImg from "../../assets/sample-images/catdog1.jpg";

const MainSection = () => {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Your One-Stop Solution for Pet Care & Beyond</h1>
        <p>
          Discover a world of comprehensive pet care services. From adoption to
          healthcare, we’ve got everything your furry friend needs.
        </p>
        <div className="hero-buttons">
          <Link to="/veterinary" className="btn black">
            Explore Services
          </Link>
          <Link to="/ai-breed-detection" className="btn outline">
            Detect Breed Now
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <img src={mainImg} alt="Pet Illustration" />
      </div>
    </section>
  );
};

export default MainSection;
