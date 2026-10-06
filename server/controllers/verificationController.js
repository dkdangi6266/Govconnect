const Verification = require("../models/Verification");
const Application = require("../models/Application");

const getApplicationVerifications = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findOne({
      _id: applicationId,
      userId: req.user.userId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const verifications = await Verification.find({
      applicationId,
      userId: req.user.userId,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      verifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getApplicationVerifications,
};