import { useState } from "react";
import { Table, Button, Image, Flex, Modal, Input } from "antd";
import AddVeterinaryModal from "../components/Modals/AddVeterinaryModal";
import {
  useDeleteVeterinaryMutation,
  useGetAllVeterinarysByFiltersQuery,
} from "../apis/veterinaries";
import { loadImageFromServer } from "../utils/common";

const Veterinaries = () => {
  const { Search } = Input;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productId, setVeterinaryId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [deleteVeterinary] = useDeleteVeterinaryMutation();

  const { data, isLoading, isFetching } = useGetAllVeterinarysByFiltersQuery({
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
    { title: "Location", dataIndex: "city", key: "city" },
    { title: "specialty", dataIndex: "specialty", key: "specialty" },
    { title: "Rating", dataIndex: "rating", key: "rating" },
    { title: "Reviews Count", dataIndex: "reviewsCount", key: "reviewsCount" },
    {
      title: "availability",
      key: "availability",
      render: ({ availability }) => {
        return availability.days.map((k) => (
          <p>
            {k} - {availability.startTime} to {availability.endTime}
          </p>
        ));
      },
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
              setVeterinaryId(_id);
              setIsDeleteModalOpen(true);
            }}
          >
            Delete
          </Button>
          <Button
            variant="solid"
            color="cyan"
            onClick={() => {
              setVeterinaryId(_id);
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
    const res = await deleteVeterinary({ id: productId });
    if (res?.data?.message === "Veterinary deleted") {
      setConfirmLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div>
      <h2 style={{ paddingBottom: "16px" }}>Veterinaries</h2>
      <Flex
        justify="space-between"
        align="center"
        style={{ paddingBottom: "16px" }}
      >
        <Search
          placeholder="Search Veterinary"
          loading={isLoading || isFetching}
          style={{ maxWidth: "300px" }}
          onSearch={(evt) => {
            setSearchText(evt);
          }}
          allowClear={true}
        />
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add Veterinary
        </Button>
      </Flex>

      {isLoading || isFetching ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table
            dataSource={data?.veterinaries || []}
            columns={columns}
            rowKey="_id"
            pagination={false}
          />
        </>
      )}
      <AddVeterinaryModal
        open={isModalOpen}
        onClose={() => {
          setVeterinaryId("");
          setIsModalOpen(false);
        }}
        id={productId}
      />
      <Modal
        title="Are you sure delete this Veterinary?"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setVeterinaryId("");
        }}
      />
    </div>
  );
};

export default Veterinaries;
