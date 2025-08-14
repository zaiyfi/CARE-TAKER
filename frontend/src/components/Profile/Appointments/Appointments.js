import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import isSameWeek from "date-fns/isSameWeek";
import addWeeks from "date-fns/addWeeks";

import { setAppointments } from "../../../redux/appointmentsSlice";
import {
  fetchAppointments,
  updateAppointment,
} from "../../../lib/helpers/appointments";
import AppointmentCard from "./components/AppointmentCard";

const Appointment = () => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointment);
  const [selectedClient, setSelectedClient] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [weekFilter, setWeekFilter] = useState("All");

  const { auth } = useSelector((state) => state.auth);

  useEffect(() => {
    if (appointments.length === 0) {
      fetchAppointments(dispatch, auth.token);
    }
  }, [auth.token]);

  // Update appointment status
  const handleUpdateStatus = async (id, status) => {
    const updated = await updateAppointment(id, { status }, auth.token);
    if (updated) {
      const updatedAppointments = appointments.map((appt) =>
        appt._id === id ? { ...appt, status } : appt
      );
      dispatch(setAppointments(updatedAppointments));
    }
  };

  const filteredAppointments = appointments?.filter((appt) => {
    const matchesStatus =
      statusFilter === "All" || appt.status === statusFilter;

    const apptDate = new Date(appt.date); // assuming appt.date is ISO string
    const now = new Date();

    let matchesWeek = true;
    if (weekFilter === "This Week") {
      matchesWeek = isSameWeek(apptDate, now, { weekStartsOn: 1 });
    } else if (weekFilter === "Next Week") {
      const nextWeekStart = addWeeks(now, 1);
      const nextWeekEnd = addWeeks(now, 1);
      matchesWeek = isSameWeek(apptDate, nextWeekStart, { weekStartsOn: 1 });
    } else if (weekFilter === "In 2 Weeks") {
      const twoWeeksStart = addWeeks(now, 2);
      const twoWeeksEnd = addWeeks(now, 2);
      matchesWeek = isSameWeek(apptDate, twoWeeksStart, { weekStartsOn: 1 });
    }

    return matchesStatus && matchesWeek;
  });
  // Calculate appointments for the current week
  const thisWeekAppointments = useMemo(() => {
    const today = new Date();
    return filteredAppointments.filter(
      (appt) => isSameWeek(new Date(appt.date), today, { weekStartsOn: 1 }) // week starts on Monday
    );
  }, [filteredAppointments]);

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          className="border p-2 rounded"
          value={weekFilter}
          onChange={(e) => setWeekFilter(e.target.value)}
        >
          <option value="All">All Weeks</option>
          <option value="This Week">This Week</option>
          <option value="Next Week">Next Week</option>
          <option value="In 2 Weeks">In 2 Weeks</option>
        </select>
      </div>

      <h3 className="text-2xl font-semibold mb-4">My Appointments</h3>

      <ul className="space-y-3">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appt) => (
            <AppointmentCard
              key={appt._id}
              appt={appt}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        ) : (
          <p>No Appointments Yet!</p>
        )}
      </ul>
    </div>
  );
};

export default Appointment;
