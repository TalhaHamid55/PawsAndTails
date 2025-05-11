import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import axios from "axios";

const Register = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      await axios.post("/api/auth/register", values);
      console.log("Registration successful");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={handleRegister} layout="vertical">
      <Form.Item name="username" label="Username" rules={[{ required: true }]}>
        {" "}
        <Input />{" "}
      </Form.Item>
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
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
