import { useState } from "react";
import { Table, Button, Flex, Input, Select } from "antd";
import AddAppointmentModal from "../components/Modals/AddAppointmentModal";
import {
  useGetAllAppointmentsByFiltersQuery,
  useUpdateAppointmentStatusMutation,
} from "../apis/appointments";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Appointments = () => {
  const { user } = useSelector((state) => state.auth);
  const { Search } = Input;
  const { Option } = Select;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentId, setAppointmentsId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("veterinary");
  const [service, setService] = useState("");
  const [city, setCity] = useState("");

  const { data, isLoading, isFetching } = useGetAllAppointmentsByFiltersQuery({
    search: searchText,
    category,
    service,
    city,
    userId: user.id,
    role: user.role,
  });

  const [updateStatus] = useUpdateAppointmentStatusMutation();

  const columns = [
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Service", dataIndex: "service", key: "service" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Description", dataIndex: "description", key: "description" },
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
            <Option value="Missed">Missed</Option>
            <Option value="Pending">Pending</Option>
            <Option value="completed">Completed</Option>
          </Select>
          <Button
            variant="solid"
            color="cyan"
            onClick={() => {
              setAppointmentsId(_id);
              setIsModalOpen(true);
            }}
          >
            Edit
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
      <h2 style={{ paddingBottom: "16px" }}>Appointments</h2>
      <Flex
        justify="space-between"
        align="center"
        style={{ paddingBottom: "16px" }}
      >
        <Search
          placeholder="Search Appointments"
          loading={isLoading || isFetching}
          style={{ maxWidth: "300px" }}
          onSearch={(evt) => {
            setSearchText(evt);
          }}
          allowClear={true}
        />
        <Flex gap={12}>
          <Select
            placeholder="Select Category"
            onChange={(value) => setCategory(value)}
            value={category}
          >
            <Option value="veterinary">Veterinary</Option>
            <Option value="grooming">Grooming</Option>
          </Select>
          <Input
            placeholder="Select Service"
            onChange={(value) => setService(value)}
            value={service}
            style={{ width: "300px" }}
          />
          <Input
            placeholder="Select City"
            onChange={(value) => setCity(value)}
            value={city}
            style={{ width: "300px" }}
          />
        </Flex>
      </Flex>

      {isLoading || isFetching ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table
            dataSource={data?.appointments || []}
            columns={columns}
            rowKey="_id"
            pagination={false}
          />
        </>
      )}
      {isModalOpen && (
        <AddAppointmentModal
          open={isModalOpen}
          onClose={() => {
            setAppointmentsId("");
            setIsModalOpen(false);
          }}
          id={appointmentId}
        />
      )}
    </div>
  );
};

export default Appointments;
