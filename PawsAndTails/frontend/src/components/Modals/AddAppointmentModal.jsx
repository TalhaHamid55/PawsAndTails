import { Modal, Form, Input, InputNumber, Flex } from "antd";
import { useState, useEffect } from "react";
import { useUploadImageMutation } from "../../apis/common";
import {
  useAddAppointmentMutation,
  useGetAppointmentByIdQuery,
  useUpdateAppointmentMutation,
} from "../../apis/appointments";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddAppointmentModal = ({ open, onClose, id, service, category }) => {
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadImage] = useUploadImageMutation();
  const [addAppointment] = useAddAppointmentMutation();
  const [updateAppointment] = useUpdateAppointmentMutation();

  const isEdit = Boolean(id);
  const { data: appointmentData, isSuccess } = useGetAppointmentByIdQuery(
    { id },
    { skip: !isEdit }
  );

  useEffect(() => {
    if (isSuccess && appointmentData && isEdit) {
      const data = {
        ...appointmentData.appointment,
      };

      form.setFieldsValue(data);

      setIsLoading(false);
    }
  }, [isSuccess, appointmentData, isEdit]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        ...values,
        userId: user.id,
        service,
        category,
        status: "pending",
      };
      const result = isEdit
        ? await updateAppointment({ id, data: payload }).unwrap()
        : await addAppointment(payload).unwrap();
      if (result) {
        toast.success(
          `Appointment ${isEdit ? "updated" : "added"} successfully`
        );
        form.resetFields();
        setFileList([]);
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit form.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      title={isEdit ? "Edit Appointment" : "Make Appointment"}
      okText={isEdit ? "Update Appointment" : "Make Appointment"}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      loading={isLoading && isEdit}
      destroyOnHidden
    >
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Form form={form} layout="vertical">
          <Flex gap={16}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Enter First Name" />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Enter Last Name" />
            </Form.Item>
          </Flex>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please Input Phone Number!",
              },
            ]}
            style={{ flex: 1 }}
          >
            <InputNumber
              minLength={11}
              maxLength={11}
              addonBefore="+92"
              style={{ width: "100%" }}
              controls={false}
            />
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            rules={[
              {
                required: true,
                message: "Please Input City!",
              },
            ]}
            style={{ flex: 1 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} placeholder="Enter Description" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddAppointmentModal;
