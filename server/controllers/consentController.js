const Consent = require("../models/Consent");
const Application = require("../models/Application");

// Grant Consent
const grantConsent = async (req, res) => {
  try {
    const {
      applicationId,
      dataType,
      purpose
    } = req.body;

    if (!applicationId || !dataType || !purpose) {
      return res.status(400).json({
        success: false,
        message: "applicationId, dataType and purpose are required"
      });
    }

    // Check application belongs to logged-in user
    const application = await Application.findOne({
      _id: applicationId,
      userId: req.user.userId
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // Check if same consent already exists
    const existingConsent = await Consent.findOne({
      userId: req.user.userId,
      applicationId,
      dataType
    });

    if (existingConsent) {
      if (existingConsent.status === "GRANTED") {
        return res.status(409).json({
          success: false,
          message: "Consent already granted"
        });
      }

      // Re-grant previously revoked consent
      existingConsent.status = "GRANTED";
      existingConsent.grantedAt = new Date();
      existingConsent.revokedAt = null;
      existingConsent.purpose = purpose;

      await existingConsent.save();

      return res.status(200).json({
        success: true,
        message: "Consent granted again successfully",
        consent: existingConsent
      });
    }

    const consent = await Consent.create({
      userId: req.user.userId,
      applicationId,
      dataType,
      purpose,
      status: "GRANTED"
    });

    res.status(201).json({
      success: true,
      message: "Consent granted successfully",
      consent
    });

  } catch (error) {
    console.error("Grant consent error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// Get My Consents
const getMyConsents = async (req, res) => {
  try {
    const consents = await Consent.find({
      userId: req.user.userId
    })
      .populate("applicationId", "status serviceId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: consents.length,
      consents
    });

  } catch (error) {
    console.error("Get consents error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// Revoke Consent
const revokeConsent = async (req, res) => {
  try {
    const consent = await Consent.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!consent) {
      return res.status(404).json({
        success: false,
        message: "Consent not found"
      });
    }

    if (consent.status === "REVOKED") {
      return res.status(409).json({
        success: false,
        message: "Consent already revoked"
      });
    }

    consent.status = "REVOKED";
    consent.revokedAt = new Date();

    await consent.save();

    res.status(200).json({
      success: true,
      message: "Consent revoked successfully",
      consent
    });

  } catch (error) {
    console.error("Revoke consent error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


module.exports = {
  grantConsent,
  getMyConsents,
  revokeConsent
};