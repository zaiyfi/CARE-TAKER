const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    location: {
      type: String,
    },
    image: {
      type: String,
      default: "",
    },
    cv: {
      type: String,
      default: "",
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    applicantId: {
      type: String,
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
    },
    applicantEmail: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
    availability: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          required: true,
        },
        startTime: {
          type: String, // Format: "17:00" for 5PM
          required: true,
        },
        endTime: {
          type: String, // Format: "22:00" for 10PM
          required: true,
        },
      },
    ],
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
      },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gig", gigSchema);
