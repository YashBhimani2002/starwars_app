import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  isAuthenticated: !!Cookies.get('token'), // Check if token exists in cookies
  token: Cookies.get('token') || null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const { token, user } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;

      // Store token in cookies
      Cookies.set('token', token, { expires: 7, secure: true });
    },
    refreshAccessToken(state, action) {
      const { token } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;

      // Remove token from cookies
      Cookies.remove('token');
    },
  },
});

export const { login,refreshAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
