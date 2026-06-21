const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["instant", "scheduled"],
      default: "instant",
    },

    meetingCode: {
      type: String,
      required: true,
      unique: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    scheduledTime: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "upcoming",
        "active",
        "ended",
      ],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Meeting",
  meetingSchema
);