import { Modal, Form, Input, message, Row, Col } from "antd";
import { useState, useEffect } from "react";
import {
  useGetUserByIdQuery,
  useUpdateUserDetailsMutation,
} from "../../apis/auth";
const AddUserModal = ({ open, onClose, id }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateUser] = useUpdateUserDetailsMutation();

  const isEdit = Boolean(id);
  const { data: userData, isSuccess } = useGetUserByIdQuery(
    { id },
    { skip: !isEdit }
  );

  useEffect(() => {
    if (isSuccess && userData && isEdit) {
      form.setFieldsValue({
        firstName: userData.user.firstName,
        lastName: userData.user.lastName,
        email: userData.user.email,
        username: userData.user.username,
      });

      setIsLoading(false);
    }
  }, [isSuccess, userData, isEdit]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = { ...values };
      const result = isEdit
        ? await updateUser({ id, data: payload }).unwrap()
        : await addUser(payload).unwrap();
      if (result) {
        message.success(`User ${isEdit ? "updated" : "added"} successfully`);
        form.resetFields();
        setFileList([]);
        onClose();
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to submit form.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      title={"Edit User"}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={"Update User"}
      loading={isLoading && isEdit}
      destroyOnHidden
    >
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: "Please input your First Name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: "Please input your Last Name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Username" name="username">
            <Input readOnly />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input readOnly />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddUserModal;
