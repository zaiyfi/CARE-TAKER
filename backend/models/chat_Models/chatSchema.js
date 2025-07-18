const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: false, // in case chat is gig-related
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
