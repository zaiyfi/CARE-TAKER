import { createSlice } from "@reduxjs/toolkit";
export const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    loading: false,
  },
  reducers: {
    setLoader: (state, action) => {
      state.loading = action.payload;
    },
  },
});
export const { setLoader } = loaderSlice.actions;
