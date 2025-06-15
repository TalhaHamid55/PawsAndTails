import { useMemo, useState } from "react";
import { Table, Button, Image, Flex, Modal, Input, Select } from "antd";
import ViewOrderDetailsModal from "../components/Modals/ViewOrderDetailsModal";
import {
  useGetAllOrdersByFiltersQuery,
  useUpdateOrderStatusMutation,
} from "../apis/orders";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Orders = () => {
  const { user } = useSelector((state) => state.auth);
  const { Search } = Input;
  const { Option } = Select;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [searchText, setSearchText] = useState("");

  const { data, isLoading, isFetching } = useGetAllOrdersByFiltersQuery({
    search: searchText,
  });
  const [updateStatus] = useUpdateOrderStatusMutation();

  const columns = [
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "State", dataIndex: "state", key: "state" },
    { title: "Total", dataIndex: "totalAmount", key: "totalAmount" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Zip Code", dataIndex: "zipCode", key: "zipCode" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Action",
      key: "action",
      hidden: user.role !== "admin",
      render: ({ _id, status }) => (
        <Flex gap={12}>
          <Select
            placeholder="Select Status"
            onChange={(value) => handleUpdateStatus(_id, value)}
            value={status}
          >
            <Option value="pending">Pending</Option>
            <Option value="processing">Processing</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
          <Button
            variant="solid"
            color="cyan"
            onClick={() => {
              setOrderId(_id);
              setIsModalOpen(true);
            }}
          >
            Show Details
          </Button>
        </Flex>
      ),
    },
  ];

  const handleUpdateStatus = async (id, status) => {
    const res = await updateStatus({ id, status });
    if (res) {
      toast.success("Status Updated");
    } else {
      toast.error("Something event wrong.! Kindly try again later");
    }
  };

  return (
    <div>
      <h2 style={{ paddingBottom: "16px" }}>Orders</h2>
      <Flex
        justify="space-between"
        align="center"
        style={{ paddingBottom: "16px" }}
      >
        <Search
          placeholder="Search Order"
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
            dataSource={data?.orders || []}
            columns={columns}
            rowKey="_id"
            pagination={false}
          />
        </>
      )}
      {isModalOpen && (
        <ViewOrderDetailsModal
          open={isModalOpen}
          onClose={() => {
            setOrderId("");
            setIsModalOpen(false);
          }}
          id={orderId}
        />
      )}
    </div>
  );
};

export default Orders;
