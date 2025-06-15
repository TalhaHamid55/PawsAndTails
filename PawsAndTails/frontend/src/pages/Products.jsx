import { useState } from "react";
import { Table, Button, Image, Flex, Modal, Input } from "antd";
import AddProductModal from "../components/Modals/AddProductModal";
import {
  useDeleteProductMutation,
  useGetAllProductsByFiltersQuery,
} from "../apis/products";
import { loadImageFromServer } from "../utils/common";

const Products = () => {
  const { Search } = Input;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [deleteProduct] = useDeleteProductMutation();

  const { data, isLoading, isFetching } = useGetAllProductsByFiltersQuery({
    search: searchText,
  });

  const columns = [
    {
      title: "Image",
      render: ({ image }) => (
        <Image width={80} src={loadImageFromServer(image)} />
      ),
      key: "image",
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "PetType", dataIndex: "petType", key: "petType" },
    { title: "Rating", dataIndex: "rating", key: "rating" },
    {
      title: "Action",
      key: "action",
      render: ({ _id }) => (
        <Flex gap={12}>
          <Button
            variant="solid"
            color="danger"
            onClick={() => {
              setProductId(_id);
              setIsDeleteModalOpen(true);
            }}
          >
            Delete
          </Button>
          <Button
            variant="solid"
            color="cyan"
            onClick={() => {
              setProductId(_id);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
        </Flex>
      ),
    },
  ];

  const handleDelete = async () => {
    setConfirmLoading(true);
    const res = await deleteProduct({ id: productId });
    if (res?.data?.message === "Product deleted") {
      setConfirmLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div>
      <h2 style={{ paddingBottom: "16px" }}>Products</h2>
      <Flex
        justify="space-between"
        align="center"
        style={{ paddingBottom: "16px" }}
      >
        <Search
          placeholder="Search Product"
          loading={isLoading || isFetching}
          style={{ maxWidth: "300px" }}
          onSearch={(evt) => {
            setSearchText(evt);
          }}
          allowClear={true}
        />
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add Product
        </Button>
      </Flex>

      {isLoading || isFetching ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table
            dataSource={data?.products || []}
            columns={columns}
            rowKey="_id"
            pagination={false}
          />
        </>
      )}
      <AddProductModal
        open={isModalOpen}
        onClose={() => {
          setProductId("");
          setIsModalOpen(false);
        }}
        id={productId}
      />
      <Modal
        title="Are you sure delete this Product?"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setProductId("");
        }}
      ></Modal>
    </div>
  );
};

export default Products;
