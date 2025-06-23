import { Button, Form, Input, Col, Row } from "antd";
import { useRegisterMutation } from "../apis/auth";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    try {
      const response = await register(values).unwrap();
      localStorage.setItem("token", response.token);
      dispatch(setCredentials(response));
      navigate("/dashboard");
      toast.success("Registration successful");
      form.resetFields();
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
    }
  };

  return (
    <div className="auth-page-container">
      <Form form={form} onFinish={handleRegister} layout="vertical">
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "Please input your First Name!" },
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
                { required: true, message: "Please input your Last Name!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input type="email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
