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
    time: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    serviceType: { type: String }, // e.g., "Physiotherapy"
    status: {
      type: String,
      enum: ["Assigned", "Completed", "Cancelled", "Pending"],
      default: "Assigned",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
