// lib/appointmentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    appointments: [],
  },
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
    addAppointment: (state, action) => {
      state.appointments.push(action.payload);
    },
  },
});

export const { setAppointments, addAppointment } = appointmentSlice.actions;

export default appointmentSlice.reducer;
