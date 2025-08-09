// lib/helpers/getAppointments.js
import { toast } from "react-toastify";
import store from "../../redux/store";
import { setAppointments } from "../../redux/appointmentsSlice";

export const fetchAppointments = async (dispatch, token) => {
  try {
    const res = await fetch("http://localhost:4000/api/appointments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      dispatch(setAppointments(data));
      console.log(store.getState());
    } else {
      toast.error(data.message || "Failed to fetch appointments");
    }
  } catch (error) {
    console.error("Fetch appointments error:", error);
    toast.error("Something went wrong while fetching appointments.");
  }
};
