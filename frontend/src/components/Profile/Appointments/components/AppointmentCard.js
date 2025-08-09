import format from "date-fns/format";

const AppointmentCard = ({ appt, onUpdateStatus }) => {
  const apptDate = new Date(appt.date);
  const formattedDate = format(apptDate, "EEEE, MMM d, yyyy");

  return (
    <li className="border p-4 rounded-lg shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {/* Client Picture */}
          {appt.client?.pic && (
            <img
              src={appt.client.pic}
              alt="Client"
              className="w-12 h-12 rounded-full object-cover"
            />
          )}

          <div>
            <p className="font-medium">Client: {appt.client.name}</p>
            <p className="text-sm text-gray-600">
              {formattedDate} @ {appt.startTime} - {appt.endTime}
            </p>

            {/* Service Type */}
            <p className="text-sm text-gray-700 font-semibold mt-1">
              Service: {appt.serviceType}
            </p>
          </div>
        </div>

        <div>
          <span
            className={`text-sm font-semibold ${
              appt.status === "Pending"
                ? "text-yellow-500"
                : appt.status === "Cancelled"
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {appt.status}
          </span>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        {appt.status === "Pending" && (
          <button
            className="px-3 py-1 bg-green-500 text-white text-sm rounded"
            onClick={() => onUpdateStatus(appt._id, "Assigned")}
          >
            Assign
          </button>
        )}

        {appt.status !== "Cancelled" && (
          <button
            className="px-3 py-1 bg-red-500 text-white text-sm rounded"
            onClick={() => onUpdateStatus(appt._id, "Cancelled")}
          >
            Cancel
          </button>
        )}
      </div>
    </li>
  );
};

export default AppointmentCard;
