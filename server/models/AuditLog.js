const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    action: {
      type: String,
      required: true,
      trim: true
    },

    resourceType: {
      type: String,
      required: true,
      trim: true
    },

    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);