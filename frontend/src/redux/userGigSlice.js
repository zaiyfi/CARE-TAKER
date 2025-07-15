import { createSlice } from "@reduxjs/toolkit";

export const userGigSlice = createSlice({
  name: "userGigs",
  initialState: {
    userGigs: [],
  },
  reducers: {
    setUserGigs: (state, action) => {
      state.userGigs = action.payload;
    },
    createUserGig: (state, action) => {
      state.userGigs = [action.payload, ...state.userGigs];
    },
    deleteUserGig: (state, action) => {
      state.userGigs = state.userGigs.filter(
        (g) => g._id !== action.payload._id
      );
    },
    updateUserGig: (state, action) => {
      const { updatedGig } = action.payload;
      const gigIndex = state.userGigs.findIndex(
        (gig) => gig._id === updatedGig._id
      );

      if (gigIndex >= 0) {
        state.userGigs[gigIndex] = updatedGig;
      }
    },
  },
});

export const { setUserGigs, createUserGig, deleteUserGig, updateUserGig } =
  userGigSlice.actions;
