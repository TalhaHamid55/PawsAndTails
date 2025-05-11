import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button } from "antd";
import { fetchProducts } from "../features/productSlice";

const Products = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Action",
      key: "action",
      render: () => <Button type="link">Edit</Button>,
    },
  ];

  return (
    <div>
      <h2>Products</h2>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : (
        <Table dataSource={items} columns={columns} rowKey="_id" />
      )}
    </div>
  );
};

export default Products;
