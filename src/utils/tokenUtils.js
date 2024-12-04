import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';

// Function to refresh token
export const RefreshToken = () => {
  const dispatch = useDispatch();

  // Simulate a new token and user refresh 
  const newToken = 'new-fake-jwt-token'; // Replace with API call to refresh token
  const user = { username: 'user' }; 
  dispatch(login({ token: newToken, user }));
};

export const setupTokenRefresh = () => {
  setTimeout(RefreshToken, 10 * 60 * 1000); 
};
