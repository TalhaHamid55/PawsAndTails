import {
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Select,
  DatePicker,
  Switch,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import { useUploadImageMutation } from "../../apis/common";
import {
  useAddAdoptionMutation,
  useGetAdoptionByIdQuery,
  useUpdateAdoptionMutation,
} from "../../apis/adoptions";
import { loadImageFromServer } from "../../utils/common";
import { locationsList, petTypes, species } from "../../utils/constant";
import moment from "moment";

const AddAdoptionModal = ({ open, onClose, id }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const petType = Form.useWatch("petType", form);
  const [uploadImage] = useUploadImageMutation();
  const [addAdoption] = useAddAdoptionMutation();
  const [updateAdoption] = useUpdateAdoptionMutation();

  const isEdit = Boolean(id);
  const { data: adoptionData, isSuccess } = useGetAdoptionByIdQuery(
    { id },
    { skip: !isEdit }
  );

  useEffect(() => {
    if (isSuccess && adoptionData && isEdit) {
      const url = loadImageFromServer(adoptionData.adoption.image);
      const name = adoptionData.adoption.image?.split("/")[2] || "image.png";
      const petAge = moment(adoptionData.adoption.age);

      const data = {
        ...adoptionData.adoption,
        age: petAge,
        image: [
          {
            uid: "1",
            name,
            status: "done",
            url,
          },
        ],
      };

      form.setFieldsValue(data);

      setIsLoading(false);
    }
  }, [isSuccess, adoptionData, isEdit]);

  useEffect(() => {
    if (!isEdit) {
      form.setFieldsValue({ breed: undefined });
    }
  }, [petType]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      let imagePath = adoptionData?.adoption.image || "";

      if (fileList.length && !fileList[0].url) {
        const formData = new FormData();
        formData.append("image", fileList[0]);
        const res = await uploadImage(formData).unwrap();
        imagePath = res.imagePath;
      }
      const payload = { ...values, image: imagePath };
      const result = isEdit
        ? await updateAdoption({ id, data: payload }).unwrap()
        : await addAdoption(payload).unwrap();
      if (result) {
        message.success(
          `Adoption ${isEdit ? "updated" : "added"} successfully`
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

  const breedList = useMemo(() => {
    return species.find((item) => item.value === petType)?.breeds || [];
  }, [petType]);

  return (
    <Modal
      title={isEdit ? "Edit Adoption" : "Add New Adoption"}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={isEdit ? "Update Adoption" : "Add Adoption"}
      loading={isLoading && isEdit}
      destroyOnHidden
    >
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enter adoption name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} placeholder="Enter adoption description" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} placeholder="Enter adoption address" />
          </Form.Item>
          <Form.Item
            label="Contact Number"
            name="contact"
            rules={[
              {
                required: true,
                message: "Please Input Contact Number!",
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
            label="Age"
            name="age"
            rules={[
              { required: true, message: "Please select the birth date!" },
            ]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Location">
              {locationsList.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="petType"
            label="Pet Type"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Pet Type">
              {petTypes.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="breed" label="Breed" rules={[{ required: true }]}>
            <Select placeholder="Select Breed">
              {breedList.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Is Available" name="available">
            <Switch />
          </Form.Item>

          <Form.Item
            name="image"
            label="Adoption Image"
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

export default AddAdoptionModal;
