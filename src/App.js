import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Header from './components/Layout/Header';
import { Layout } from 'antd';
import Dashboard from './components/Pages/Dashboard/Dashboard';
import ProtectedRoute from "./utils/ProtectedRoute.js"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={() => <Login />}></Route>
      </Routes>
      <Layout>
        <Header />
        <Routes>
          <Route path='/dashboard' Component={()=><ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
          <Route path='/*' Component={() => <div>404 Page</div>}></Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
