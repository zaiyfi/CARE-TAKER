import { createSlice } from "@reduxjs/toolkit";
export const notifSlice = createSlice({
  name: "notif",
  initialState: {
    notif: "none",
  },
  reducers: {
    setNotif: (state, action) => {
      state.notif = action.payload;
    },
  },
});
export const { setNotif } = notifSlice.actions;
