import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/logo.png"
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-gray-800 text-white py-1 px-4 flex justify-between h-full">
      <div className='w-20 h-full'>
        <img src={Logo} className='h-full w-full object-cover' alt='logo'/>
      </div>
      <div className='flex items-center'>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white flex items-center justify-center rounded hover:bg-red-600 w-20 h-10"
      >
        Logout
      </button>
      </div>
    </header>
  );
};

export default Header;
