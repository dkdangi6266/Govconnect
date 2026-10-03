const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

    status: {
      type: String,
      enum: [
        "PENDING",
        "VERIFIED",
        "FAILED"
      ],
      default: "PENDING"
    },

    source: {
      type: String,
      default: ""
    },

    verifiedAt: {
      type: Date,
      default: null
    },

    remarks: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

verificationSchema.index(
  { applicationId: 1, dataType: 1 },
  { unique: true }
);

module.exports = mongoose.model("Verification", verificationSchema);