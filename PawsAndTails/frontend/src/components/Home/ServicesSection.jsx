import React from "react";

const ServicesSection = () => {
  return (
    <section className="core-services">
      <h2>Our Core Services</h2>
      <p>Everything your pet needs, all in one place</p>
      <div className="service-grid">
        <div className="service-card">
          <h3>Pet Adoption</h3>
          <p>Find loving homes for pets in need.</p>
        </div>
        <div className="service-card">
          <h3>Veterinary Care</h3>
          <p>24/7 access to trusted pet doctors.</p>
        </div>
        <div className="service-card">
          <h3>Grooming</h3>
          <p>Keep your pets looking their best.</p>
        </div>
        <div className="service-card">
          <h3>AI Breed Detection</h3>
          <p>Instantly recognize your pet's breed.</p>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
