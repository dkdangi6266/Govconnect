const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    requiredDocuments: [
      {
        type: String
      }
    ],
    requiredVerifications: {
  type: [
    {
      type: String,
      enum: [
        "IDENTITY",
        "INCOME",
        "EDUCATION",
        "RESIDENCE",
      ],
    },
  ],
  default: [],
},

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Service", serviceSchema);