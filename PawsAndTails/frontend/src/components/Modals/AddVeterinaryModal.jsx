import {
  Modal,
  Form,
  Input,
  Upload,
  Button,
  message,
  Select,
  TimePicker,
  InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useUploadImageMutation } from "../../apis/common";
import {
  useAddVeterinaryMutation,
  useGetVeterinaryByIdQuery,
  useUpdateVeterinaryMutation,
} from "../../apis/veterinaries";
import { loadImageFromServer } from "../../utils/common";
import { locationsList, veterinarySpecialties } from "../../utils/constant";
import dayjs from "dayjs";

const daysOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
  (day) => ({ label: day, value: day })
);

const AddVeterinaryModal = ({ open, onClose, id }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const availabilityPR = Form.useWatch("availability", form);
  const [uploadImage] = useUploadImageMutation();
  const [addVeterinary] = useAddVeterinaryMutation();
  const [updateVeterinary] = useUpdateVeterinaryMutation();

  const isEdit = Boolean(id);
  const { data: veterinaryData, isSuccess } = useGetVeterinaryByIdQuery(
    { id },
    { skip: !isEdit }
  );

  useEffect(() => {
    if (isSuccess && veterinaryData && isEdit) {
      const vet = veterinaryData.veterinary;
      const imageUrl = loadImageFromServer(vet.image);
      const imageName = vet.image?.split("/")[2] || "image.png";

      const data = {
        ...vet,
        image: [
          {
            uid: "1",
            name: imageName,
            status: "done",
            url: imageUrl,
          },
        ],
        availability: {
          days: vet.availability.days,
          startTime: dayjs(vet.availability?.startTime, "h:mm A"),
          endTime: dayjs(vet.availability?.endTime, "h:mm A"),
        },
      };

      form.setFieldsValue(data);

      setFileList([data.image[0]]);
      setIsLoading(false);
    }
  }, [isSuccess, veterinaryData, isEdit]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      let imagePath = veterinaryData?.veterinary.image || "";

      if (fileList.length && !fileList[0].url) {
        const formData = new FormData();
        formData.append("image", fileList[0]);
        const res = await uploadImage(formData).unwrap();
        imagePath = res.imagePath;
      }

      const payload = {
        ...values,
        image: imagePath,
        availability: {
          ...values.availability,
          startTime: dayjs(values.availability.startTime).format("h:mm A"),
          endTime: dayjs(values.availability.endTime).format("h:mm A"),
        },
      };

      const result = isEdit
        ? await updateVeterinary({ id, data: payload }).unwrap()
        : await addVeterinary(payload).unwrap();

      if (result) {
        message.success(
          `Veterinary ${isEdit ? "updated" : "added"} successfully`
        );
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
      title={isEdit ? "Edit Veterinary" : "Add New Veterinary"}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={isEdit ? "Update Veterinary" : "Add Veterinary"}
      confirmLoading={isLoading && isEdit}
      destroyOnClose
    >
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enter veterinary name" />
          </Form.Item>

          <Form.Item
            name="specialty"
            label="Specialty"
            rules={[{ required: true }]}
          >
            <Select placeholder="Enter specialty (e.g. Dentistry, Surgery)">
              {veterinarySpecialties.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="rating" label="Rating" initialValue={0}>
            <InputNumber min={0} max={5} step={0.1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="reviewsCount"
            label="Reviews Count"
            rules={[{ type: "number", min: 0 }]}
          >
            <InputNumber
              placeholder="Enter number of reviews"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item name="city" label="City" rules={[{ required: true }]}>
            <Select placeholder="Select City">
              {locationsList.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name={["availability", "days"]}
            label="Available Days"
            rules={[{ required: true, type: "array", min: 1 }]}
          >
            <Select
              mode="multiple"
              options={daysOptions}
              placeholder="Select available days"
            />
          </Form.Item>

          <Form.Item
            name={["availability", "startTime"]}
            label="Start Time"
            rules={[{ required: true }]}
          >
            <TimePicker format="h:mm A" use12Hours style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name={["availability", "endTime"]}
            label="End Time"
            rules={[{ required: true }]}
          >
            <TimePicker format="h:mm A" use12Hours style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="image"
            label="Veterinary Image"
            valuePropName="fileList"
            getValueFromEvent={() => fileList}
            rules={[{ required: true, message: "Please upload an image!" }]}
          >
            <Upload
              listType="picture"
              fileList={fileList}
              beforeUpload={(file) => {
                setFileList([file]);
                return false;
              }}
              onRemove={() => setFileList([])}
              accept="image/*"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddVeterinaryModal;
