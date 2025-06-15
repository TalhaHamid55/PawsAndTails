import { useState } from "react";
import { Select, Col, Row, Spin, Button } from "antd";
import groomtip from "../assets/sample-images/groomtip1.webp";
import groomtip2 from "../assets/sample-images/groomtip2.webp";
import groomtip3 from "../assets/sample-images/groomtip3.jpg";
import { groomingServices, locationsList } from "../utils/constant";
import { useGetAllGroomingsByFiltersQuery } from "../apis/groomings";
import GroomingCard from "../components/GroomingCard";
import BlogContainer from "../components/BlogContainer";

const Grooming = () => {
  const { Option } = Select;
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [range, setRange] = useState("");
  const [sortBy, setSortBy] = useState("");

  const { data, isLoading, isFetching } = useGetAllGroomingsByFiltersQuery({
    service,
    location,
    sortBy,
    ...(range === "0-1000" && { minPrice: 0, maxPrice: 1000 }),
    ...(range === "1000-2000" && { minPrice: 1000, maxPrice: 2000 }),
    ...(range === "2000+" && { minPrice: 2000, maxPrice: 50000 }),
  });

  return (
    <div>
      <div className="filter-bar">
        <Select
          placeholder="Select Service"
          style={{ width: "200px" }}
          onChange={(value) => setService(value)}
          value={service}
        >
          <Option value="">All Services</Option>
          {groomingServices.map((k) => (
            <Option key={k.value} value={k.value}>
              {k.name}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Select Location"
          style={{ width: "200px" }}
          onChange={(value) => setLocation(value)}
          value={location}
        >
          <Option value="">All Cities</Option>
          {locationsList.map((k) => (
            <Option key={k.value} value={k.value}>
              {k.name}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Select Range"
          style={{ width: "200px" }}
          onChange={(value) => setRange(value)}
          value={range}
        >
          <Option value="">Price Range</Option>
          <Option value="0-1000">Under Rs. 1000</Option>
          <Option value="1000-2000">Rs. 1000 - 2000</Option>
          <Option value="2000+">Above Rs. 2000</Option>
        </Select>

        <Select
          placeholder="Select Sort By"
          style={{ width: "200px" }}
          onChange={(value) => setSortBy(value)}
          value={sortBy}
        >
          <Option value="">Sort By</Option>
          <Option value="rating">Rating</Option>
          <Option value="price">Price</Option>
          <Option value="availability">Availability</Option>
        </Select>

        <Button
          onClick={() => {
            setSortBy("");
            setRange("");
            setLocation("");
            setService("");
          }}
          variant="solid"
          color="primary"
        >
          Reset Filters
        </Button>
      </div>
      <main>
        <h2 className="section-title">Available Grooming Services</h2>
        <section style={{ padding: "0 28px 28px 28px" }}>
          {isFetching || isLoading ? (
            <div className="empty-state">
              <Spin />
            </div>
          ) : (
            <>
              {!data || data.groomings.length === 0 ? (
                <div className="empty-state">No Service Found.</div>
              ) : (
                <Row gutter={32}>
                  {data.groomings.map((item) => (
                    <Col span={8}>
                      <GroomingCard key={item._id} {...item} />
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}
        </section>
        <h2 className="section-title">Featured Grooming Tips</h2>
        <section style={{ padding: "0 28px 28px 28px" }}>
          <BlogContainer category="grooming" />
        </section>
      </main>
    </div>
  );
};

export default Grooming;
