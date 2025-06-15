import { useState } from "react";
import { Table, Button, Image, Flex, Modal, Input } from "antd";
import AddGroomingModal from "../components/Modals/AddGroomingModal";
import {
  useDeleteGroomingMutation,
  useGetAllGroomingsByFiltersQuery,
} from "../apis/groomings";
import { getServiceName, loadImageFromServer } from "../utils/common";

const PetGrooming = () => {
  const { Search } = Input;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productId, setGroomingId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [deleteGrooming] = useDeleteGroomingMutation();

  const { data, isLoading, isFetching } = useGetAllGroomingsByFiltersQuery({
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
    { title: "Name", dataIndex: "title", key: "title" },
    { title: "Location", dataIndex: "city", key: "city" },
    {
      title: "Services",
      key: "services",
      render: ({ services }) => {
        return services.map((k) => <p>{getServiceName(k)}</p>);
      },
    },
    { title: "Rating", dataIndex: "rating", key: "rating" },
    { title: "Reviews Count", dataIndex: "reviewsCount", key: "reviewsCount" },
    {
      title: "Availability",
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
              setGroomingId(_id);
              setIsDeleteModalOpen(true);
            }}
          >
            Delete
          </Button>
          <Button
            variant="solid"
            color="cyan"
            onClick={() => {
              setGroomingId(_id);
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
    const res = await deleteGrooming({ id: productId });
    if (res?.data?.message === "Grooming deleted") {
      setConfirmLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div>
      <h2 style={{ paddingBottom: "16px" }}>Pet Grooming</h2>
      <Flex
        justify="space-between"
        align="center"
        style={{ paddingBottom: "16px" }}
      >
        <Search
          placeholder="Search Grooming"
          loading={isLoading || isFetching}
          style={{ maxWidth: "300px" }}
          onSearch={(evt) => {
            setSearchText(evt);
          }}
          allowClear={true}
        />
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add Grooming
        </Button>
      </Flex>

      {isLoading || isFetching ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table
            dataSource={data?.groomings || []}
            columns={columns}
            rowKey="_id"
            pagination={false}
          />
        </>
      )}
      <AddGroomingModal
        open={isModalOpen}
        onClose={() => {
          setGroomingId("");
          setIsModalOpen(false);
        }}
        id={productId}
      />
      <Modal
        title="Are you sure delete this Grooming?"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setGroomingId("");
        }}
      />
    </div>
  );
};

export default PetGrooming;
