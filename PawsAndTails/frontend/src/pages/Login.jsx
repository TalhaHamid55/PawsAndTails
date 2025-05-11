import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "../features/authSlice";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", values);
      dispatch(setUser(response.data.user));
      dispatch(setToken(response.data.token));
      console.log("Login successful");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={handleLogin} layout="vertical">
      <Form.Item name="email" label="Email" rules={[{ required: true }]}>
        {" "}
        <Input />{" "}
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        {" "}
        <Input.Password />{" "}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
