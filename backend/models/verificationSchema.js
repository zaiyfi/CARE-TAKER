const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One verification per user
    },
    caregiverType: {
      type: String,
      enum: ["Child", "Elderly", "Pet", "Other"],
      required: true,
    },
    cnicFront: {
      type: String,
      required: true, // URL to uploaded image (Cloudinary, S3, etc.)
    },
    cnicBack: {
      type: String,
      required: true,
    },
    certificate: {
      type: String, // optional
      default: "",
    },
    selfieWithCnic: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    adminRemarks: {
      type: String,
      default: "",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Verification", verificationSchema);
