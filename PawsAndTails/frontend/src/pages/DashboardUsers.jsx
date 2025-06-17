import { useState } from "react";
import { Table, Button, Flex, Modal, Input } from "antd";
import AddUserModal from "../components/Modals/AddUserModal";

import {
  useGetAllUsersByFiltersQuery,
  useDeleteUserMutation,
} from "../apis/auth";

const DashboardUsers = () => {
  const { Search } = Input;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [deleteUser] = useDeleteUserMutation();

  const { data, isLoading, isFetching } = useGetAllUsersByFiltersQuery({
    search: searchText,
  });

  const columns = [
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "UserName", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "email" },

    {
      title: "Action",
      key: "action",
      render: ({ _id }) => (
        <Flex gap={12}>
          <Button
            variant="solid"
            color="danger"
            onClick={() => {
              setUserId(_id);
              setIsDeleteModalOpen(true);
            }}
          >
            Delete
          </Button>
          <Button
            variant="solid"
            color="cyan"
            onClick={() => {
              setUserId(_id);
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
    const res = await deleteUser({ id: userId });
    if (res?.data?.message === "User deleted") {
      setConfirmLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div>
      <h2 style={{ paddingBottom: "16px" }}>Users</h2>
      <Flex
        justify="space-between"
        align="center"
        style={{ paddingBottom: "16px" }}
      >
        <Search
          placeholder="Search User"
          loading={isLoading || isFetching}
          style={{ maxWidth: "300px" }}
          onSearch={(evt) => {
            setSearchText(evt);
          }}
          allowClear={true}
        />
      </Flex>

      {isLoading || isFetching ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table
            dataSource={data?.users || []}
            columns={columns}
            rowKey="_id"
            pagination={false}
          />
        </>
      )}
      <AddUserModal
        open={isModalOpen}
        onClose={() => {
          setUserId("");
          setIsModalOpen(false);
        }}
        id={userId}
      />
      <Modal
        title="Are you sure delete this User?"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setUserId("");
        }}
      />
    </div>
  );
};

export default DashboardUsers;
