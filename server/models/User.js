const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: [
        "citizen",
        "government_officer",
        "department_admin",
        "super_admin"
      ],
      default: "citizen"
    },

    governmentId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model("User", userSchema);