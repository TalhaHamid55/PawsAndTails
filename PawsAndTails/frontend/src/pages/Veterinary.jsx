import { useState } from "react";
import { Button, Select } from "antd";
import { useGetAllVeterinarysByFiltersQuery } from "../apis/veterinaries";
import VeterinaryCard from "../components/VeterinaryCard";
import { locationsList, veterinarySpecialties } from "../utils/constant";
import BlogContainer from "../components/BlogContainer";

const Veterinary = () => {
  const { Option } = Select;
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [availability, setAvailability] = useState("");
  const [rating, setRating] = useState("");
  const { data } = useGetAllVeterinarysByFiltersQuery({
    location,
    speciality: specialty,
    availability,
    rating,
  });

  return (
    <div>
      <div className="filter-bar">
        <Select
          placeholder="Select City"
          style={{ width: "200px" }}
          onChange={(value) => setLocation(value)}
          value={location}
        >
          <Option value="">All Cities</Option>
          {locationsList.map((item) => (
            <Option value={item.value}>{item.name}</Option>
          ))}
        </Select>

        <Select
          placeholder="Select Specialty"
          style={{ width: "200px" }}
          onChange={(value) => setSpecialty(value)}
          value={specialty}
        >
          <Option value="">All Specialty</Option>
          {veterinarySpecialties.map((item) => (
            <Option value={item.value}>{item.name}</Option>
          ))}
        </Select>

        <Select
          placeholder="Select Availability"
          style={{ width: "200px" }}
          onChange={(value) => setAvailability(value)}
          value={availability}
        >
          <Option value="">Availability</Option>
          <Option value="Today">Available Today</Option>
          <Option value="Tomorrow">Available Tomorrow</Option>
          <Option value="This Week">This Week</Option>
          <Option value="Weekends">Weekends</Option>
        </Select>

        <Select
          placeholder="Select Rating"
          style={{ width: "200px" }}
          onChange={(value) => setRating(value)}
          value={rating}
        >
          <Option value="">Any Rating</Option>
          <Option value="4">4+ stars</Option>
          <Option value="3">3+ stars</Option>
          <Option value="2">2+ stars</Option>
        </Select>
        <Button
          onClick={() => {
            setAvailability("");
            setLocation("");
            setRating("");
            setSpecialty("");
          }}
          variant="solid"
          color="primary"
        >
          Reset Filters
        </Button>
      </div>
      <h2 className="section-title">Available Veterinarians</h2>
      <div className="cards">
        {data?.veterinaries.map((item) => (
          <VeterinaryCard key={item._id} {...item} />
        ))}
      </div>

      <div className="section-title">Pet Health Tips</div>
      <section style={{ padding: "0 28px 28px" }}>
        <BlogContainer category="veterinary" />
      </section>
    </div>
  );
};

export default Veterinary;
