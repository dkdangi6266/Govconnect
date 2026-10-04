const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      default: null
    },

    type: {
      type: String,
      enum: [
        "APPLICATION_SUBMITTED",
        "APPLICATION_APPROVED",
        "APPLICATION_REJECTED",
        "APPLICATION_STATUS_UPDATED"
      ],
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);