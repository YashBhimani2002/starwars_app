import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import {useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import Login from './components/Auth/Login';
import Header from './components/Layout/Header';
import Dashboard from './components/Pages/Dashboard/Dashboard';
import ProtectedRoute from './utils/ProtectedRoute';


const { Header: AntHeader, Content, Footer } = Layout;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const status = useSelector((state) => state.auth.isAuthenticated);
  
  useEffect(() => {
    setIsLoggedIn(status);
  }, [status]);

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Conditionally render Header */}
        {isLoggedIn && window.location.pathname !== '/' && <AntHeader style={{
          padding: 0, height: '10vh', position: 'sticky',
          top: '0px',
          zIndex: 9999
        }}><Header /></AntHeader>}

        <Layout>
          {/* Main Content */}
          <Layout className='bg-gray-200'>

            <Content
            >
              <Routes>
                <Route path="/" element={<CheckTokenValidity><Login /></CheckTokenValidity>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/*" element={<div>404 Page Not Found</div>} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
        {isLoggedIn && window.location.pathname !== '/' &&  <Footer className='flex bg-gray-800 text-white items-center justify-center h-[6vh] ' >
          Ant Design ©2024 Created by Yash Bhimani
          </Footer>}
      </Layout>
    </BrowserRouter >
  );
}

// Function to check if the token cookie exists
export const CheckTokenValidity = ({ children }) => {
  const token = Cookies.get('token'); // Get the token from cookies
  const isTokenValid = Boolean(token); // True if token exists (valid cookie)

  // Redirect to the dashboard if token exists
  return isTokenValid ? <Navigate to="/dashboard" /> : children;
};

export default App;
