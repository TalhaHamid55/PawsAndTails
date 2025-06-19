import { Button, Form, Input } from "antd";
import { useSignInMutation } from "../apis/auth";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../features/authSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useSignInMutation();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated]);

  const handleLogin = async (values) => {
    try {
      const response = await login(values).unwrap();

      localStorage.setItem("token", response.token);
      dispatch(setCredentials(response));

      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="auth-page-container">
      <Form form={form} onFinish={handleLogin} layout="vertical">
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
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
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
