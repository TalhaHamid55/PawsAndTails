import { useState } from "react";
import { Table, Button, Image, Flex, Modal, Input } from "antd";
import AddAdoptionModal from "../components/Modals/AddAdoptionModal";

import {
  useGetAllAdoptionsByFiltersQuery,
  useDeleteAdoptionMutation,
} from "../apis/adoptions";
import { loadImageFromServer } from "../utils/common";

const PetAdoptions = () => {
  const { Search } = Input;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productId, setAdoptionId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [deleteAdoption] = useDeleteAdoptionMutation();

  const { data, isLoading, isFetching } = useGetAllAdoptionsByFiltersQuery({
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
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Owner's Name", dataIndex: "ownerName", key: "ownerName" },
    { title: "PetType", dataIndex: "petType", key: "petType" },
    { title: "Breed", dataIndex: "breed", key: "breed" },
    { title: "Age", dataIndex: "petAge", key: "petAge" },
    {
      title: "Availability",
      key: "available",
      render: ({ available }) => (
        <p>{available ? "Available" : "Not Available"}</p>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: ({ _id }) => (
        <Flex gap={12}>
          <Button
            variant="solid"
            color="danger"
            onClick={() => {
              setAdoptionId(_id);
              setIsDeleteModalOpen(true);
            }}
          >
            Delete
          </Button>
          <Button
            variant="solid"
            color="cyan"
            onClick={() => {
              setAdoptionId(_id);
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
    const res = await deleteAdoption({ id: productId });
    if (res?.data?.message === "Adoption deleted") {
      setConfirmLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div>
      <h2 style={{ paddingBottom: "16px" }}>Adoptions</h2>
      <Flex
        justify="space-between"
        align="center"
        style={{ paddingBottom: "16px" }}
      >
        <Search
          placeholder="Search Adoption"
          loading={isLoading || isFetching}
          style={{ maxWidth: "300px" }}
          onSearch={(evt) => {
            setSearchText(evt);
          }}
          allowClear={true}
        />
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add Adoption
        </Button>
      </Flex>

      {isLoading || isFetching ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table
            dataSource={data?.adoptions || []}
            columns={columns}
            rowKey="_id"
            pagination={false}
          />
        </>
      )}
      <AddAdoptionModal
        open={isModalOpen}
        onClose={() => {
          setAdoptionId("");
          setIsModalOpen(false);
        }}
        id={productId}
      />
      <Modal
        title="Are you sure delete this Adoption?"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setAdoptionId("");
        }}
      />
    </div>
  );
};

export default PetAdoptions;
