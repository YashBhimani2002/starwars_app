import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import apiReducer from "./slices/apiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    data: apiReducer
  },
});

export default store;
