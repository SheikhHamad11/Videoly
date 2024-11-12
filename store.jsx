// store.js
import {configureStore} from '@reduxjs/toolkit';
import userReducer from './src/Redux/UserSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
  },
});
