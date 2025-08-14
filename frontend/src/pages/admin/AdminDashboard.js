import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoader } from "../../redux/loaderSlice";
import { setAppointments } from "../../redux/appointmentsSlice";
import { format, differenceInMinutes } from "date-fns";
import isValid from "date-fns/isValid";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const { auth } = useSelector((state) => state.auth);
  const appointments = useSelector((state) => state.appointment.appointments);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAppointments = async () => {
      dispatch(setLoader(true));
      try {
        const res = await fetch("/api/appointments/admin", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          dispatch(setAppointments(data));
        }
      } catch (err) {
        console.error("Error fetching admin appointments:", err);
      } finally {
        dispatch(setLoader(false));
      }
    };

    fetchAppointments();
  }, [auth, dispatch]);

  // Chart data: show "Caregiver - Client" and duration in hours
  const chartData = useMemo(() => {
    if (!appointments?.length) return [];

    return appointments.map((appt) => {
      const startDateTime = new Date(
        `${appt.date.split("T")[0]}T${appt.startTime}`
      );
      const endDateTime = new Date(
        `${appt.date.split("T")[0]}T${appt.endTime}`
      );

      const startFormatted = format(startDateTime, "hh:mm a");
      const endFormatted = format(endDateTime, "hh:mm a");

      const durationHours = (
        differenceInMinutes(endDateTime, startDateTime) / 60
      ).toFixed(1);

      return {
        label: `${appt.caregiver.name} → ${appt.client.name}`,
        caregiverPic: appt.caregiver.pic,
        clientPic: appt.client.pic,
        dateTime: `${startFormatted} - ${endFormatted}`,
        duration: Number(durationHours),
      };
    });
  }, [appointments]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">All Appointments Overview</h1>

      {/* Chart Section */}
      {chartData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">
            Appointments Duration
          </h2>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
            >
              <defs>
                {/* Gradient Fill */}
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

              <XAxis
                type="number"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                label={{
                  value: "Hours",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#374151",
                }}
              />

              <YAxis
                type="category"
                dataKey="label"
                width={200}
                tick={({ x, y, payload }) => {
                  const item = chartData.find((d) => d.label === payload.value);
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={0}
                        y={0}
                        dy={4}
                        textAnchor="end"
                        fill="#374151"
                        fontSize={13}
                        fontWeight={500}
                      >
                        {payload.value}
                      </text>
                      <text
                        x={0}
                        y={14}
                        dy={4}
                        textAnchor="end"
                        fill="#9ca3af"
                        fontSize={11}
                      >
                        {item?.dateTime}
                      </text>
                    </g>
                  );
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  padding: "8px 12px",
                }}
                labelStyle={{ fontWeight: "bold", color: "#374151" }}
              />

              <Bar
                dataKey="duration"
                fill="url(#barGradient)"
                radius={[8, 8, 8, 8]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Appointment Cards */}
      {appointments?.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appt) => {
            const dateObj = appt.date ? new Date(appt.date) : null;
            const formattedDate =
              dateObj && isValid(dateObj)
                ? format(dateObj, "EEEE, MMM d, yyyy")
                : "Unknown date";

            const start = appt.startTime
              ? new Date(`1970-01-01T${appt.startTime}`)
              : null;
            const end = appt.endTime
              ? new Date(`1970-01-01T${appt.endTime}`)
              : null;
            const durationHours =
              start && end && isValid(start) && isValid(end)
                ? ((end - start) / (1000 * 60 * 60)).toFixed(1)
                : 0;

            return (
              <li
                key={appt._id}
                className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-3">
                  {appt.caregiver?.pic && (
                    <img
                      src={appt.caregiver.pic}
                      alt="Caregiver"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">
                      Caregiver: {appt.caregiver?.name || "—"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Service: {appt.serviceType || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  {appt.client?.pic && (
                    <img
                      src={appt.client.pic}
                      alt="Client"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">
                      Client: {appt.client?.name || "—"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {appt.client?.email || "No email"}
                    </p>
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-700">
                  <p>{formattedDate}</p>
                  <p>
                    {appt.startTime || "—"} - {appt.endTime || "—"} (
                    {durationHours} hrs)
                  </p>
                </div>

                <div className="mt-2">
                  <span
                    className={`text-sm font-semibold ${
                      appt.status === "Pending"
                        ? "text-yellow-500"
                        : appt.status === "Cancelled"
                        ? "text-red-500"
                        : appt.status === "Completed"
                        ? "text-blue-500"
                        : "text-green-600"
                    }`}
                  >
                    {appt.status || "Unknown"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-center p-4 text-gray-500">No appointments found.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
