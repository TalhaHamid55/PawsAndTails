import { Modal, Form, Input, Upload, Button, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import { useUploadImageMutation } from "../../apis/common";
import {
  useAddBlogMutation,
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
} from "../../apis/blogs";
import { loadImageFromServer } from "../../utils/common";
import { postCategories } from "../../utils/constant";
const AddBlogModal = ({ open, onClose, id }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadImage] = useUploadImageMutation();
  const [addBlog] = useAddBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();

  const isEdit = Boolean(id);
  const { data: blogData, isSuccess } = useGetBlogByIdQuery(
    { id },
    { skip: !isEdit }
  );

  useEffect(() => {
    if (isSuccess && blogData && isEdit) {
      const url = loadImageFromServer(blogData.blog.image);
      const name = blogData.blog.image?.split("/")[2] || "image.png";

      const data = {
        ...blogData.blog,
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
  }, [isSuccess, blogData, isEdit]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      let imagePath = blogData?.blog.image || "";

      if (fileList.length && !fileList[0].url) {
        const formData = new FormData();
        formData.append("image", fileList[0]);
        const res = await uploadImage(formData).unwrap();
        imagePath = res.imagePath;
      }
      const payload = { ...values, image: imagePath };
      const result = isEdit
        ? await updateBlog({ id, data: payload }).unwrap()
        : await addBlog(payload).unwrap();
      if (result) {
        message.success(`Blog ${isEdit ? "updated" : "added"} successfully`);
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
      title={isEdit ? "Edit Blog" : "Add New Blog"}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={isEdit ? "Update Blog" : "Add Blog"}
      loading={isLoading && isEdit}
      destroyOnHidden
    >
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Enter blog name" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} placeholder="Enter post description" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Category">
              {postCategories.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="image"
            label="Blog Image"
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

export default AddBlogModal;
