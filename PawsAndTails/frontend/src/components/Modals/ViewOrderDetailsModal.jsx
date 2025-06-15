import { Modal, Table, Image } from "antd";
import { useGetOrderDetailsByIdQuery } from "../../apis/orders";
import { loadImageFromServer } from "../../utils/common";
const columns = [
  {
    title: "Image",
    render: ({ image }) => (
      <Image width={50} src={loadImageFromServer(image)} />
    ),
    key: "image",
  },
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Price", dataIndex: "price", key: "price" },
  { title: "Brand", dataIndex: "brand", key: "brand" },
];

const ViewOrderDetailsModal = ({ id, open, onClose }) => {
  const { data, isLoading, isFetching } = useGetOrderDetailsByIdQuery({ id });

  return (
    <Modal open={open} onClose={onClose} onCancel={onClose} footer={<></>}>
      <Table
        bordered
        dataSource={data?.order?.products || []}
        columns={columns}
        rowKey="_id"
        pagination={false}
        loading={isLoading || isFetching}
      />
    </Modal>
  );
};

export default ViewOrderDetailsModal;
