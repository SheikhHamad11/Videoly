// features/user/userSlice.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  users: [],
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const {id, field, value} = action.payload;
      const existingUser = state.users.find(user => user.id === id);
      if (existingUser) {
        existingUser[field] = value; // Update specific field
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
  },
});

export const {addUser, updateUser, deleteUser} = userSlice.actions;
export default userSlice.reducer;
