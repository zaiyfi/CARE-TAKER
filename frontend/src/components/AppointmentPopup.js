import { useState } from "react";
import { format, addDays, parseISO } from "date-fns";

const AppointmentPopup = ({ onClose, onSubmit, availability, category }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [dayName, setDayName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedCategory] = useState(category || "");

  // Get the weekday name from date
  const getDayName = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" });

  // Available days from backend
  const availableDays = [
    ...new Set(availability?.map((slot) => slot.day.toLowerCase())),
  ];

  // Check if selected date is available
  const isDateAvailable = (dateStr) =>
    availableDays.includes(getDayName(dateStr).toLowerCase());

  // Generate next 30 available dates
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

  const handleDateChange = (e) => {
    const dateStr = e.target.value;
    if (!isDateAvailable(dateStr)) {
      setSelectedDate("");
      setDayName("");
      return;
    }
    setSelectedDate(dateStr);
    setDayName(getDayName(dateStr));
  };

  const handleSubmit = () => {
    if (!selectedDate || !startTime || !endTime) {
      alert("Please select a date, start time, and end time");
      return;
    }

    onSubmit({
      date: selectedDate,
      day: dayName,
      startTime,
      endTime,
      category: selectedCategory,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 relative shadow-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 text-xl hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Book Appointment
        </h2>

        {/* Date picker */}
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

        {/* Start Time */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border border-gray-300 rounded p-2 text-sm"
          />
        </div>

        {/* End Time */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border border-gray-300 rounded p-2 text-sm"
          />
        </div>

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

        {/* Submit */}
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
