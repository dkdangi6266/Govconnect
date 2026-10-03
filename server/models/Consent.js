const mongoose = require("mongoose");

const consentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true
    },

    dataType: {
      type: String,
      required: true,
      enum: [
        "IDENTITY",
        "INCOME",
        "EDUCATION",
        "RESIDENCE"
      ]
    },

    purpose: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["GRANTED", "REVOKED"],
      default: "GRANTED"
    },

    grantedAt: {
      type: Date,
      default: Date.now
    },

    revokedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Consent", consentSchema);