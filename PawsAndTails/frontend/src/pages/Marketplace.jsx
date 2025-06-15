import mainImg from "../assets/sample-images/pet-store-banner.jpg";
import { useState } from "react";
import { Input, Checkbox, Select, Flex, Spin } from "antd";
import { useGetAllProductsByFiltersQuery } from "../apis/products";
import ProductCard from "../components/ProductCard";
import BlogContainer from "../components/BlogContainer";
import { petTypes, categories, brands } from "../utils/constant";

const Marketplace = () => {
  const { Search } = Input;
  const { Option } = Select;

  const [searchText, setSearchText] = useState("");
  const [petTypeList, setPetTypeList] = useState(new Set([]));
  const [categoryList, setCategoryList] = useState(new Set([]));
  const [brandList, setBrandList] = useState(new Set([]));
  const [range, setRange] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const { data, isLoading, isFetching } = useGetAllProductsByFiltersQuery({
    search: searchText,
    sort: sortBy,
    petType: [...petTypeList].join(","),
    brand: [...brandList].join(","),
    category: [...categoryList].join(","),
    ...(range === "0-200" && { minPrice: 0, maxPrice: 200 }),
    ...(range === "200-800" && { minPrice: 200, maxPrice: 800 }),
    ...(range === "800-50000" && { minPrice: 800, maxPrice: 50000 }),
  });

  return (
    <div>
      <main className="main-content">
        <aside className="filters">
          <Search
            placeholder="Search Product"
            loading={isLoading || isFetching}
            style={{ maxWidth: "300px" }}
            onSearch={(evt) => {
              setSearchText(evt);
            }}
            allowClear={true}
          />
          <h3>Pet Type</h3>
          <ul>
            {petTypes.map((item) => (
              <li key={item.value}>
                <Checkbox
                  checked={petTypeList.has(item.value)}
                  onChange={(evt) => {
                    const newSet = new Set(petTypeList);
                    if (newSet.has(item.value)) {
                      newSet.delete(item.value);
                    } else {
                      newSet.add(item.value);
                    }
                    setPetTypeList(newSet);
                  }}
                >
                  {item.label}
                </Checkbox>
              </li>
            ))}
          </ul>
          <h3>Categories</h3>
          <ul>
            {categories.map((item) => (
              <li key={item.value}>
                <Checkbox
                  checked={categoryList.has(item.value)}
                  onChange={(evt) => {
                    const newSet = new Set(categoryList);
                    if (newSet.has(item.value)) {
                      newSet.delete(item.value);
                    } else {
                      newSet.add(item.value);
                    }
                    setCategoryList(newSet);
                  }}
                >
                  {item.label}
                </Checkbox>
              </li>
            ))}
          </ul>
          <h3>Price Range</h3>
          <ul>
            <li>
              <Checkbox
                checked={range === "0-200"}
                onChange={(evt) => {
                  setRange(range === "0-200" ? "" : "0-200");
                }}
              >
                Under Rs.200
              </Checkbox>
            </li>
            <li>
              <Checkbox
                checked={range === "200-800"}
                onChange={(evt) => {
                  setRange(range === "200-800" ? "" : "200-800");
                }}
              >
                Rs.200 - Rs.800
              </Checkbox>
            </li>
            <li>
              <Checkbox
                checked={range === "800-50000"}
                onChange={(evt) => {
                  setRange(range === "800-50000" ? "" : "800-50000");
                }}
              >
                Over Rs.800
              </Checkbox>
            </li>
          </ul>
          <h3>Brand</h3>
          <ul>
            {brands.map((item) => (
              <li key={item.value}>
                <Checkbox
                  checked={brandList.has(item.value)}
                  onChange={(evt) => {
                    const newSet = new Set(brandList);
                    if (newSet.has(item.value)) {
                      newSet.delete(item.value);
                    } else {
                      newSet.add(item.value);
                    }
                    setBrandList(newSet);
                  }}
                >
                  {item.label}
                </Checkbox>
              </li>
            ))}
          </ul>
        </aside>

        <section className="product-area">
          <img src={mainImg} alt="Pet Store Banner" className="banner" />

          <div className="product-header">
            <h2>Featured Products</h2>
            <Flex gap={12} align="center">
              <label>Sort By:</label>
              <Select
                style={{ width: 200 }}
                onChange={(value) => setSortBy(value)}
                value={sortBy}
                placeholder="Select Sort By"
              >
                <Option value="popular">Most Popular</Option>
                <Option value="priceLowToHigh">Price: Low to High</Option>
                <Option value="priceHighToLow">Price: High to Low</Option>
                <Option value="newest">Newest</Option>
              </Select>
            </Flex>
          </div>
          {isFetching || isLoading ? (
            <div className="empty-state">
              <Spin />
            </div>
          ) : (
            <>
              {!data ||
              !Array.isArray(data?.products) ||
              data.products.length === 0 ? (
                <div className="empty-state">No Product Found.</div>
              ) : (
                <div className="product-grid">
                  {data?.products.map((item) => (
                    <ProductCard key={item._id} {...item} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <hr style={{ marginInline: "24px" }} />
      <h2 className="section-title">Blogs</h2>
      <section style={{ padding: "24px" }}>
        <BlogContainer category="marketPlace" />
      </section>
    </div>
  );
};

export default Marketplace;
