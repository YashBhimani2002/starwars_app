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
    <header className="bg-gray-800 text-white p-4 flex justify-between fixed top-0 right-0 left-0 z-10">
      <div className='w-20 h-12'>
        <img src={Logo} className='h-full w-full object-cover' />
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 pb-2 pt-[0.3rem] rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
