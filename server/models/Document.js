const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
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

    documentType: {
      type: String,
      required: true,
      enum: [
        "IDENTITY_PROOF",
        "INCOME_CERTIFICATE",
        "EDUCATION_CERTIFICATE",
        "RESIDENCE_PROOF",
        "OTHER"
      ]
    },

    originalName: {
      type: String,
      required: true
    },

    fileName: {
      type: String,
      required: true
    },

    filePath: {
      type: String,
      required: true
    },

    mimeType: {
      type: String,
      required: true
    },

    fileSize: {
      type: Number,
      required: true
    },

    verificationStatus: {
      type: String,
      enum: [
        "PENDING",
        "VERIFIED",
        "REJECTED"
      ],
      default: "PENDING"
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

documentSchema.index({
  applicationId: 1,
  documentType: 1
});

module.exports = mongoose.model(
  "Document",
  documentSchema
);