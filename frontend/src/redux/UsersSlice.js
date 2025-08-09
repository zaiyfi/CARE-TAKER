import { createSlice } from "@reduxjs/toolkit";

export const allUsersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
  },
  reducers: {
    setAllUsers: (state, action) => {
      state.users = action.payload;
    },
    updateUser: (state, action) => {
      const updatedUser = action.payload;
      if (state.users) {
        const index = state.users.findIndex(
          (user) => user._id === updatedUser._id
        );
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      }
    },
  },
});

export const { setAllUsers, updateUser } = allUsersSlice.actions;
