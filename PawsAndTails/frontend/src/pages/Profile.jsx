import { useEffect, useState } from "react";
import { Button, Col, Flex, Form, Input, Row } from "antd";
import {
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
} from "../apis/auth";
import { toast } from "react-toastify";

const Profile = () => {
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(false);
  const { data, isLoading, isFetching } = useGetUserDetailsQuery();
  const [updateUserDetails, { isLoading: LoadingFormUpdateValue }] =
    useUpdateUserDetailsMutation();

  useEffect(() => {
    if (!isLoading && !isFetching && data?.user) {
      form.setFieldsValue({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        username: data.user.username,
      });
    }
  }, [isLoading, isFetching, data, form]);

  const onFinish = async (values) => {
    const res = await updateUserDetails({
      id: data.user._id,
      data: values,
    }).unwrap();
    if (res) {
      setIsEditMode(false);
      toast.success("Details Updated");
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      {!isEditMode && (
        <Flex justify="end">
          <Button variant="outlined" onClick={() => setIsEditMode(true)}>
            Edit Details
          </Button>
        </Flex>
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                {
                  required: isEditMode,
                  message: "Please input your First Name!",
                },
              ]}
            >
              <Input readOnly={!isEditMode} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                {
                  required: isEditMode,
                  message: "Please input your Last Name!",
                },
              ]}
            >
              <Input readOnly={!isEditMode} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Username" name="username">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input readOnly />
        </Form.Item>
        {isEditMode && (
          <Flex gap={12}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={LoadingFormUpdateValue}
              >
                Submit
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="default"
                htmlType="button"
                onClick={() => setIsEditMode(false)}
              >
                Cancel
              </Button>
            </Form.Item>
          </Flex>
        )}
      </Form>
    </div>
  );
};

export default Profile;
