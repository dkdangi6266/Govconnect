const {
  verifyApplicationData
} = require("../services/verificationService");
const identityService = require("../integrations/identityService");
const incomeService = require("../integrations/incomeService");
const educationService = require("../integrations/educationService");
const residenceService = require("../integrations/residenceService");


const verifyIdentity = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await identityService(userId);

    return res.status(200).json(result);

  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
const verifyIncome = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await incomeService(userId);

    return res.status(200).json(result);

  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
const verifyEducation = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await educationService(userId);

    return res.status(200).json(result);

  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};


const verifyResidence = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await residenceService(userId);

    return res.status(200).json(result);

  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
const verifyApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { dataType } = req.body;

    if (!dataType) {
      return res.status(400).json({
        success: false,
        message: "dataType is required"
      });
    }

    const result = await verifyApplicationData({
      applicationId,
      userId: req.user.userId,
      dataType
    });

    return res.status(200).json({
      success: true,
      message: "Data verified successfully",
      result
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};
module.exports = {
  verifyIdentity,
  verifyIncome,
  verifyEducation,
  verifyResidence,
  verifyApplication
};