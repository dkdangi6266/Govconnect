const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createOfficer = async (req, res) => {
  try {
    const { name, email, password, governmentId } = req.body;

    if (!name || !email || !password || !governmentId) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and governmentId are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const officer = await User.create({
      name,
      email,
      password: hashedPassword,
      governmentId,
      role: "government_officer"
    });

    return res.status(201).json({
      success: true,
      message: "Government officer created successfully",
      officer: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        governmentId: officer.governmentId,
        role: officer.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const getOfficers = async (req, res) => {
  try {
    const officers = await User.find(
      { role: "government_officer" },
      "name email governmentId role"
    ).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: officers.length,
      officers,
    });
  } catch (error) {
    console.error("Get officers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch officers",
    });
  }
};

module.exports = {
  createOfficer,
  getOfficers
};