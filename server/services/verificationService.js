const Application = require("../models/Application");
const Consent = require("../models/Consent");
const User = require("../models/User");
const Verification = require("../models/Verification");
const Service = require("../models/Service");

const identityService = require("../integrations/identityService");
const incomeService = require("../integrations/incomeService");
const educationService = require("../integrations/educationService");
const residenceService = require("../integrations/residenceService");

const verifyApplicationData = async ({
  applicationId,
  userId,
  dataType,
}) => {
  // 1. Check application ownership
  const application = await Application.findOne({
    _id: applicationId,
    userId,
  });

  if (!application) {
    const error = new Error("Application not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Get service details
  const service = await Service.findById(application.serviceId);

  if (!service) {
    const error = new Error("Service not found");
    error.statusCode = 404;
    throw error;
  }

  // 3. Check whether this data type is required
  const requiredDataTypes =
    service.requiredVerifications || [];

  if (!requiredDataTypes.includes(dataType)) {
    const error = new Error(
      `${dataType} verification is not required for this service`
    );

    error.statusCode = 400;
    throw error;
  }

  // 4. Get user's government ID
  const user = await User.findById(userId);

  if (!user || !user.governmentId) {
    const error = new Error(
      "Government identity mapping not found"
    );

    error.statusCode = 404;
    throw error;
  }

  // 5. Check consent
  const consent = await Consent.findOne({
    applicationId,
    userId,
    dataType,
    status: "GRANTED",
  });

  if (!consent) {
    const error = new Error(
      "Valid consent is required before accessing this data"
    );

    error.statusCode = 403;
    throw error;
  }

  // 6. Call appropriate government service
  let result;

  switch (dataType) {
    case "IDENTITY":
      result = await identityService(
        user.governmentId
      );
      break;

    case "INCOME":
      result = await incomeService(
        user.governmentId
      );
      break;

    case "EDUCATION":
      result = await educationService(
        user.governmentId
      );
      break;

    case "RESIDENCE":
      result = await residenceService(
        user.governmentId
      );
      break;

    default: {
      const error = new Error(
        "Unsupported data type"
      );

      error.statusCode = 400;
      throw error;
    }
  }

  // 7. Save / update verification record
  const verification =
    await Verification.findOneAndUpdate(
      {
        applicationId,
        dataType,
      },
      {
        userId,
        status: result.data.verified
          ? "VERIFIED"
          : "FAILED",

        source: result.source,

        verifiedAt: result.data.verified
          ? new Date()
          : null,

        remarks: result.data.verified
          ? "Data verified successfully"
          : "Data verification failed",
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

  // 8. Get all required verification records
  const completedVerifications =
    await Verification.find({
      applicationId,
      userId,
      status: "VERIFIED",
    });

  // 9. Find which required types are verified
  const verifiedTypes =
    completedVerifications.map(
      (verification) =>
        verification.dataType
    );

  // 10. Check whether ALL required verifications
  // for this particular service are complete
  const allVerified =
    requiredDataTypes.length > 0 &&
    requiredDataTypes.every((type) =>
      verifiedTypes.includes(type)
    );

  // 11. Update application status
  if (allVerified) {
    application.status = "OFFICER_REVIEW";
    await application.save();
  } else if (result.data.verified) {
    application.status =
      "VERIFICATION_IN_PROGRESS";

    await application.save();
  }

  // 12. Return verification result
  return {
    applicationId,
    dataType,

    consentStatus: consent.status,

    verificationStatus:
      verification.status,

    verified:
      result.data.verified,

    source: result.source,

    requiredVerifications:
      requiredDataTypes,

    verifiedTypes,

    allVerified,

    applicationStatus:
      application.status,

    data: result.data,
  };
};

module.exports = {
  verifyApplicationData,
};