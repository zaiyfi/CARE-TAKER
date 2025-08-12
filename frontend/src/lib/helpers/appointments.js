// lib/helpers/appointments.js
import { toast } from "react-toastify";
import { setAppointments } from "../../redux/appointmentsSlice";
import store from "../../redux/store";

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

export const updateAppointment = async (appointmentId, updateData, token) => {
  try {
    const res = await fetch(`/api/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to update appointment");
      return null;
    }

    toast.success("Appointment updated successfully");
    return data;
  } catch (error) {
    console.error("Error updating appointment:", error);
    toast.error("Something went wrong while updating the appointment.");
    return null;
  }
};
