const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },

    assignedOfficerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    status: {
      type: String,
      enum: [
        "PENDING_VERIFICATION",
        "VERIFICATION_IN_PROGRESS",
        "OFFICER_REVIEW",
        "APPROVED",
        "REJECTED"
      ],
      default: "PENDING_VERIFICATION"
    },

    remarks: {
      type: String,
      default: ""
    },

    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

applicationSchema.index(
  { userId: 1, serviceId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Application", applicationSchema);