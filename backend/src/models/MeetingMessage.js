const mongoose = require("mongoose");

const meetingMessageSchema =
  new mongoose.Schema(
    {
      meetingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meeting",
        required: true,
      },

      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      content: {
        type: String,
        required: true,
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "MeetingMessage",
  meetingMessageSchema
);