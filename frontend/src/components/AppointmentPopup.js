import { useState, useEffect } from "react";
import { format, addDays, parseISO } from "date-fns";

const AppointmentPopup = ({ onClose, onSubmit, availability, category }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [dayName, setDayName] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(category || "");

  // Get the weekday name from date
  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedSlot || !selectedDate) {
      alert("Please select a date and time slot");
      return;
    }

    const { startTime, endTime } = selectedSlot;

    onSubmit({
      date: selectedDate,
      day: dayName,
      startTime,
      endTime,
      category: selectedCategory,
    });
  };

  // Get available day names from availability
  const availableDays = [
    ...new Set(availability?.map((slot) => slot.day.toLowerCase())),
  ];

  // Disable dates not in availability
  const isDateAvailable = (dateStr) => {
    const day = getDayName(dateStr).toLowerCase();
    return availableDays.includes(day);
  };

  const handleDateChange = (e) => {
    const dateStr = e.target.value;
    const day = getDayName(dateStr);

    // Prevent selecting unavailable days
    if (!isDateAvailable(dateStr)) {
      setSelectedDate("");
      setDayName("");
      setSelectedSlot(null);
      return;
    }

    setSelectedDate(dateStr);
    setDayName(day);
    setSelectedSlot(null); // Reset slot
  };

  // Filter time slots for selected day
  const filteredSlots = availability?.filter(
    (slot) => slot.day.toLowerCase() === dayName.toLowerCase()
  );

  const getTodayDate = () => format(addDays(new Date(), 1), "yyyy-MM-dd");

  // Generate next 14 available days
  const generateAvailableDates = () => {
    const dates = [];
    let date = addDays(new Date(), 1);
    while (dates.length < 30) {
      const dateStr = format(date, "yyyy-MM-dd");
      if (isDateAvailable(dateStr)) dates.push(dateStr);
      date = addDays(date, 1);
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 text-xl hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Book Appointment
        </h2>

        {/* Date Picker */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Select Appointment Date
          </label>
          <select
            value={selectedDate}
            onChange={handleDateChange}
            className="border border-gray-300 rounded p-2 text-sm"
          >
            <option value="">Select available date</option>
            {availableDates.map((dateStr) => (
              <option key={dateStr} value={dateStr}>
                {format(parseISO(dateStr), "EEEE, MMM d")}
              </option>
            ))}
          </select>
        </div>

        {/* Time Slots */}
        {selectedDate ? (
          filteredSlots?.length > 0 ? (
            <div className="text-sm bg-gray-100 p-2 rounded">
              <h3 className="font-medium mb-1 text-gray-700">
                Available Time Slots:
              </h3>
              <ul className="space-y-2">
                {filteredSlots.map((slot, index) => (
                  <li
                    key={index}
                    className={`p-2 rounded border cursor-pointer transition-all duration-150 ${
                      selectedSlot === slot
                        ? "bg-primary text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot.startTime} - {slot.endTime}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No slots available for this date.
            </p>
          )
        ) : (
          <p className="text-sm text-gray-500">
            Please select a date to view available time slots.
          </p>
        )}

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            value={selectedCategory}
            className="border border-gray-300 rounded p-2 text-sm bg-gray-100 cursor-not-allowed"
            readOnly
          />
        </div>

        <button
          className="bg-primary text-white w-full py-2 rounded hover:bg-lightPrimary transition-colors duration-200"
          onClick={handleSubmit}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default AppointmentPopup;
