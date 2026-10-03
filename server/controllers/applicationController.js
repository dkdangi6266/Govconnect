const Application = require("../models/Application");
const Service = require("../models/Service");

// Create Application
const createApplication = async (req, res) => {
  try {
    const { serviceId } = req.body;

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: "serviceId is required"
      });
    }

    // Check service exists and is active
    const service = await Service.findOne({
      _id: serviceId,
      isActive: true
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found or inactive"
      });
    }

    // Prevent duplicate application
    const existingApplication = await Application.findOne({
      userId: req.user.userId,
      serviceId
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this service"
      });
    }

    const application = await Application.create({
      userId: req.user.userId,
      serviceId
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application
    });

  } catch (error) {
    console.error("Create application error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// Get logged-in user's applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.user.userId
    })
      .populate("serviceId", "name code description")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });

  } catch (error) {
    console.error("Get applications error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// Get single application
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("serviceId", "name code description")
      .populate("userId", "name email");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // Citizen can only access their own application
    if (
      req.user.role === "citizen" &&
      application.userId._id.toString() !== req.user.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    res.status(200).json({
      success: true,
      application
    });

  } catch (error) {
    console.error("Get application error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const allowedStatuses = [
      "PENDING_VERIFICATION",
      "VERIFICATION_IN_PROGRESS",
      "OFFICER_REVIEW",
      "APPROVED",
      "REJECTED"
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status"
      });
    }
    const validTransitions = {
  PENDING_VERIFICATION: ["VERIFICATION_IN_PROGRESS"],
  VERIFICATION_IN_PROGRESS: ["OFFICER_REVIEW"],
  OFFICER_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: [],
  REJECTED: []
};

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

const currentStatus = application.status;

if (!validTransitions[currentStatus].includes(status)) {
  return res.status(400).json({
    success: false,
    message: `Invalid status transition from ${currentStatus} to ${status}`
  });
}

application.status = status;

    if (remarks !== undefined) {
      application.remarks = remarks;
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application
    });

  } catch (error) {
    console.error("Update application status error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


module.exports = {
  createApplication,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus
};