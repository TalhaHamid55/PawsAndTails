import { Button, Col, Select, Spin, Row } from "antd";
import { locationsList, petAgesList, species } from "../utils/constant";
import { useMemo, useState } from "react";

import { useGetAllAdoptionsByFiltersQuery } from "../apis/adoptions";
import PetAdoptionCard from "../components/PetAdoptionCard";
import BlogContainer from "../components/BlogContainer";
const Adoption = () => {
  const [petType, setPetType] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const { Option } = Select;
  const { data, isLoading, isFetching } = useGetAllAdoptionsByFiltersQuery({
    breed,
    petType,
    age,
    location,
  });

  const breedsList = useMemo(() => {
    const res = species.find((item) => item.value === petType)?.breeds || [];
    return res;
  }, [petType]);

  return (
    <>
      <div className="filter-bar">
        <Select
          placeholder="Select Species"
          style={{ width: "200px" }}
          onChange={(value) => setPetType(value)}
          value={petType}
        >
          <Option value="">Select Species</Option>
          {species.map((item) => (
            <Option value={item.value}>{item.name}</Option>
          ))}
        </Select>

        <Select
          placeholder="Select Breed"
          style={{ width: "200px" }}
          onChange={(value) => setBreed(value)}
          value={breed}
        >
          <Option value="">Select Breed</Option>
          {breedsList.map((item) => (
            <Option value={item.value}>{item.name}</Option>
          ))}
        </Select>

        <Select
          placeholder="Select Age"
          style={{ width: "200px" }}
          onChange={(value) => setAge(value)}
          value={age}
        >
          <Option value="">Select Age</Option>
          {petAgesList.map((item) => (
            <Option value={item.value}>{item.name}</Option>
          ))}
        </Select>

        <Select
          placeholder="Select City"
          style={{ width: "200px" }}
          onChange={(value) => setLocation(value)}
          value={location}
        >
          <Option value="">Select City</Option>
          {locationsList.map((item) => (
            <Option value={item.value}>{item.name}</Option>
          ))}
        </Select>

        <Button
          onClick={() => {
            setAge("");
            setBreed("");
            setLocation("");
            setPetType("");
          }}
          variant="solid"
          color="primary"
        >
          Reset Filters
        </Button>
      </div>

      <main>
        <section style={{ padding: "28px" }}>
          {isFetching || isLoading ? (
            <div className="empty-state">
              <Spin />
            </div>
          ) : (
            <>
              {!data || data.adoptions.length === 0 ? (
                <div className="empty-state">No Pet Found.</div>
              ) : (
                <Row gutter={32}>
                  {data.adoptions.map((item) => (
                    <Col span={8}>
                      <PetAdoptionCard key={item._id} {...item} />
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}
        </section>
        <h2 className="section-title">Stories</h2>
        <section style={{ padding: "0 28px" }}>
          <BlogContainer category="adoptions" />
        </section>
        <section className="stats-section">
          <div>
            <h3>127</h3>
            <p>Available Pets</p>
          </div>
          <div>
            <h3>45</h3>
            <p>Recent Adoptions</p>
          </div>
          <div>
            <h3>312</h3>
            <p>Success Stories</p>
          </div>
          <div>
            <h3>89</h3>
            <p>Foster Homes</p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Adoption;
