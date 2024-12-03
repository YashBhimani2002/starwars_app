import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Header from './components/Layout/Header';
import { Layout } from 'antd';
import Dashboard from './components/Pages/Dashboard/Dashboard';
import ProtectedRoute from "./utils/ProtectedRoute.js"
import { useSelector } from 'react-redux';

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  return (
    <BrowserRouter>
     <div className="app-container">
        {/* Conditionally render Header and Sidebar */}
        {isLoggedIn && window.location.pathname !== "/" && (
          <>
            <Header />
          </>
        )}
        {/* Routes */}
        <div className="main-content">
          <Routes>
          <Route path='/' Component={() => <Login />}></Route>
          <Route path='/dashboard' Component={()=><ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
          <Route path='/*' Component={() => <div>404 Page</div>}></Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
