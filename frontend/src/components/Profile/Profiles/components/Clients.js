const Clients = () => {
  const caregivers = [
    {
      _id: "1",
      name: "Ayesha Malik",
      skill: "Elderly Care",
      pic: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      _id: "2",
      name: "Zain Ahmed",
      skill: "Disability Support",
      pic: "https://randomuser.me/api/portraits/men/47.jpg",
    },
  ];

  const appointments = [
    {
      _id: "a1",
      caregiverName: "Ayesha Malik",
      date: "2025-08-01",
      time: "10:00 AM",
      purpose: "Routine Check & Medication",
    },
    {
      _id: "a2",
      caregiverName: "Zain Ahmed",
      date: "2025-08-03",
      time: "3:30 PM",
      purpose: "Mobility Assistance",
    },
  ];

  const clientPreferences = {
    preferredTimeSlot: "Morning",
    preferredDays: ["Mon", "Wed", "Fri"],
    allowOvernight: false,
    emergencyContact: {
      name: "Ali Khan",
      relationship: "Son",
      phone: "+92 300 1234567",
    },
  };

  return (
    <div className="mt-6 space-y-8 text-gray-800 px-4">
      {/* Assigned Caregivers */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Assigned Caregivers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {caregivers.map((cg) => (
            <div
              key={cg._id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={cg.pic}
                  alt={cg.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-lg">{cg.name}</h4>
                  <p className="text-sm text-gray-500">{cg.skill}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Upcoming Appointments</h3>
        <ul className="space-y-3">
          {appointments.map((appt) => (
            <li key={appt._id} className="border p-4 rounded-lg shadow-sm">
              <div className="flex justify-between">
                <span className="font-medium">{appt.caregiverName}</span>
                <span className="text-sm text-gray-500">
                  {new Date(appt.date).toLocaleDateString()} @ {appt.time}
                </span>
              </div>
              <p className="text-sm text-gray-600">{appt.purpose}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Preferences */}
      <div>
        <h3 className="text-2xl font-semibold mb-2">Care Preferences</h3>
        <ul className="text-sm text-gray-700 list-disc pl-5">
          <li>Preferred Time Slot: {clientPreferences.preferredTimeSlot}</li>
          <li>Preferred Days: {clientPreferences.preferredDays.join(", ")}</li>
          <li>
            Allow Overnight Care:{" "}
            {clientPreferences.allowOvernight ? "Yes" : "No"}
          </li>
        </ul>
      </div>

      {/* Emergency Contact */}
      <div>
        <h3 className="text-2xl font-semibold mb-2">Emergency Contact</h3>
        <p className="text-sm">
          <span className="font-medium">Name:</span>{" "}
          {clientPreferences.emergencyContact.name}
        </p>
        <p className="text-sm">
          <span className="font-medium">Relation:</span>{" "}
          {clientPreferences.emergencyContact.relationship}
        </p>
        <p className="text-sm">
          <span className="font-medium">Phone:</span>{" "}
          {clientPreferences.emergencyContact.phone}
        </p>
      </div>
    </div>
  );
};

export default Clients;
