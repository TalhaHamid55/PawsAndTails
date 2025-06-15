import {
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useUploadImageMutation } from "../../apis/common";
import {
  useAddProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../apis/products";
import { loadImageFromServer } from "../../utils/common";
import { categories, petTypes, brands } from "../../utils/constant";

const AddProductModal = ({ open, onClose, id }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadImage] = useUploadImageMutation();
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const isEdit = Boolean(id);
  const { data: productData, isSuccess } = useGetProductByIdQuery(
    { id },
    { skip: !isEdit }
  );

  useEffect(() => {
    if (isSuccess && productData && isEdit) {
      const url = loadImageFromServer(productData.product.image);
      const name = productData.product.image?.split("/")[2] || "image.png";

      const data = {
        ...productData.product,
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
  }, [isSuccess, productData, isEdit]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      let imagePath = productData?.product.image || "";

      if (fileList.length && !fileList[0].url) {
        const formData = new FormData();
        formData.append("image", fileList[0]);
        const res = await uploadImage(formData).unwrap();
        imagePath = res.imagePath;
      }
      const payload = { ...values, image: imagePath };
      const result = isEdit
        ? await updateProduct({ id, data: payload }).unwrap()
        : await addProduct(payload).unwrap();
      if (result) {
        message.success(`Product ${isEdit ? "updated" : "added"} successfully`);
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
      title={isEdit ? "Edit Product" : "Add New Product"}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={isEdit ? "Update Product" : "Add Product"}
      loading={isLoading && isEdit}
      destroyOnHidden
    >
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} placeholder="Enter product description" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, type: "number", min: 0 }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Category">
              {categories.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
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

          <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
            <Select placeholder="Brand name">
              {brands.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="stock" label="Stock" initialValue={0}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="rating" label="Rating" initialValue={0}>
            <InputNumber min={0} max={5} step={0.1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="image"
            label="Product Image"
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

export default AddProductModal;
