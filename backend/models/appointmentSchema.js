const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    caregiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // e.g. "10:00"
    endTime: { type: String, required: true }, // e.g. "11:00"
    serviceType: { type: String },
    status: {
      type: String,
      enum: ["Assigned", "Completed", "Cancelled", "Pending"],
      default: "Assigned",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
