import React, { useState } from "react";
import { Form, Input, Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    console.log("Login Data:", values);
    const validUsername = 'user';
    const validPassword = 'password';

    if (values.username === validUsername && values.password === validPassword) {
      const token = 'mock-jwt-token'; // Mock token
      const user = { username: values.username }; // Mock user
      dispatch(login({ token, user })); // Dispatch the login action with token and user details
      navigate('/dashboard'); // Navigate to the dashboard
    } else {
      setModalType("Failure"); // Define action modal type eg. Failure
      setModalMessage('Invalid username or password'); // Define modal message for show reponse
      setModalpen(true); // Open modal
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-300">
        <div className="w-full max-w-md p-8 bg-white rounded shadow-lg">
          <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>
          <Form
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* Username Field */}
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please enter your username!" },
                { min: 4, message: "Username must be at least 4 characters long!" },
              ]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
                { min: 6, message: "Password must be at least 6 characters long!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Modal
        title={modalType}
        centered
        open={modalOpen}
        onCancel={() => setModalpen(false)}
        footer={null}
      >
        <p className="text-green-500">{modalMessage}</p>
      </Modal>
    </>

  );
};

export default Login;
