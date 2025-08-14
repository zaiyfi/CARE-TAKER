import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments } from "../../../../lib/helpers/getAppointments";

const Clients = () => {
  const { appointments } = useSelector((state) => state.appointment);
  const { auth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (appointments.length === 0) {
      fetchAppointments(dispatch, auth.token);
    }
  }, [auth.token]);

  const assignedAppointments = appointments.filter(
    (appt) => appt.status === "Assigned"
  );

  return (
    <div className="mt-6 space-y-10 text-gray-800 px-4">
      {/* Assigned Caregivers */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Assigned Caregivers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedAppointments.length > 0 ? (
            assignedAppointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex items-center gap-4 mb-2">
                  <img
                    src={appt.caregiver?.pic}
                    alt={appt.caregiver?.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">
                      {appt.caregiver?.name}
                    </h4>
                    <p className="text-sm text-gray-500">Disability</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Appointment:{" "}
                  <span className="font-medium">
                    {new Date(appt.date).toLocaleDateString()} @{" "}
                    {appt.startTime} - {appt.endTime}
                  </span>
                </p>
              </div>
            ))
          ) : (
            <p>No Assigned Caregivers</p>
          )}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Upcoming Appointments</h3>
        <ul className="space-y-3">
          {assignedAppointments.length > 0 ? (
            assignedAppointments.map((appt) => {
              const date = new Date(appt.date);
              const day = date.toLocaleDateString("en-US", {
                weekday: "long",
              });
              const dateString = date.toLocaleDateString(); // e.g. MM/DD/YYYY

              return (
                <li
                  key={appt._id}
                  className="border p-4 rounded-lg shadow-sm bg-white"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{appt.caregiver?.name}</span>
                    <span className="text-sm text-gray-500">
                      {day}, {dateString} @ {appt.startTime} - {appt.endTime}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Service: {appt.serviceType}
                  </p>
                </li>
              );
            })
          ) : (
            <p>No Upcoming Appointments</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Clients;
