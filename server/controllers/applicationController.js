const Application = require("../models/Application");
const Service = require("../models/Service");
const User = require("../models/User");

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
    const { id } = req.params;
    const { status, remarks } = req.body;

    const allowedStatuses = ["APPROVED", "REJECTED"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be APPROVED or REJECTED"
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    if (application.status !== "OFFICER_REVIEW") {
      return res.status(400).json({
        success: false,
        message: "Application is not ready for officer review"
      });
    }

    // Assign current officer if not already assigned
    if (
      req.user.role === "government_officer" &&
      !application.assignedOfficerId
    ) {
      application.assignedOfficerId = req.user.userId;
    }

    // If application is already assigned to another officer
    if (
      req.user.role === "government_officer" &&
      application.assignedOfficerId &&
      application.assignedOfficerId.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Application is assigned to another officer"
      });
    }

    application.status = status;
    application.remarks = remarks || "";

    await application.save();

    return res.status(200).json({
      success: true,
      message: `Application ${status.toLowerCase()} successfully`,
      application
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const getOfficerApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      status: "OFFICER_REVIEW"
    })
      .populate("userId", "name email governmentId")
      .populate("serviceId", "name code description")
      .populate("assignedOfficerId", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const assignApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { officerId } = req.body;

    if (!officerId) {
      return res.status(400).json({
        success: false,
        message: "officerId is required"
      });
    }

    const officer = await User.findOne({
      _id: officerId,
      role: "government_officer"
    });

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: "Government officer not found"
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    if (application.status !== "OFFICER_REVIEW") {
      return res.status(400).json({
        success: false,
        message: "Application is not ready for officer assignment"
      });
    }

    application.assignedOfficerId = officerId;

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application assigned successfully",
      application
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
module.exports = {
  createApplication,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
  getOfficerApplications,
  assignApplication
};