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
  useAddGroomingMutation,
  useGetGroomingByIdQuery,
  useUpdateGroomingMutation,
} from "../../apis/groomings";
import { loadImageFromServer } from "../../utils/common";
import { locationsList, groomingServices } from "../../utils/constant";
import dayjs from "dayjs";

const daysOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
  (day) => ({ label: day, value: day })
);

const AddGroomingModal = ({ open, onClose, id }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isEdit = Boolean(id);
  const { data: groomingData, isSuccess } = useGetGroomingByIdQuery(
    { id },
    { skip: !isEdit }
  );

  const [uploadImage] = useUploadImageMutation();
  const [addGrooming] = useAddGroomingMutation();
  const [updateGrooming] = useUpdateGroomingMutation();

  useEffect(() => {
    if (isSuccess && groomingData?.grooming && isEdit) {
      const grooming = groomingData.grooming;
      const imageUrl = loadImageFromServer(grooming.image);
      const imageName = grooming.image?.split("/")[2] || "image.png";

      const data = {
        ...grooming,
        image: [
          {
            uid: "1",
            name: imageName,
            status: "done",
            url: imageUrl,
          },
        ],
        availability: {
          days: grooming.availability.days,
          startTime: dayjs(grooming.availability?.startTime, "h:mm A"),
          endTime: dayjs(grooming.availability?.endTime, "h:mm A"),
        },
      };

      form.setFieldsValue(data);
      setFileList([data.image[0]]);
      setIsLoading(false);
    }
  }, [isSuccess, groomingData, isEdit]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      let imagePath = groomingData?.grooming?.image || "";

      if (fileList.length && !fileList[0].url) {
        const formData = new FormData();
        formData.append("image", fileList[0]);
        const res = await uploadImage(formData).unwrap();
        imagePath = res.imagePath;
      }

      const payload = {
        title: values.title,
        services: values.services,
        price: values.price,
        rating: values.rating,
        reviewsCount: values.reviewsCount,
        city: values.city,
        image: imagePath,
        availability: {
          days: values.availability.days,
          startTime: dayjs(values.availability.startTime).format("h:mm A"),
          endTime: dayjs(values.availability.endTime).format("h:mm A"),
        },
      };

      const result = isEdit
        ? await updateGrooming({ id, data: payload }).unwrap()
        : await addGrooming(payload).unwrap();

      if (result) {
        message.success(
          `Grooming ${isEdit ? "updated" : "added"} successfully`
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
      title={isEdit ? "Edit Grooming" : "Add New Grooming"}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={isEdit ? "Update Grooming" : "Add Grooming"}
      confirmLoading={isLoading && isEdit}
      destroyOnClose
    >
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Enter grooming service title" />
          </Form.Item>

          <Form.Item
            name="services"
            label="Services"
            rules={[{ required: true, type: "array", min: 1 }]}
          >
            <Select
              mode="tags"
              placeholder="Enter or select services (e.g. Bath, Nail Trim)"
              options={groomingServices.map((item) => ({
                label: item.name,
                value: item.value,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, type: "number", min: 0 }]}
          >
            <InputNumber
              placeholder="Enter price"
              style={{ width: "100%" }}
              min={0}
            />
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
            label="Grooming Image"
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

export default AddGroomingModal;
