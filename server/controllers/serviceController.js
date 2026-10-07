const Service = require("../models/Service");
const Department = require("../models/Department");

// Allowed verification types
const allowedVerifications = [
  "IDENTITY",
  "INCOME",
  "EDUCATION",
  "RESIDENCE",
];

// Create Service
const createService = async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);

    const {
      name,
      code,
      description,
      departmentId,
      requiredDocuments,
      requiredVerifications,
    } = req.body || {};

    // Check required fields
    if (!name || !code || !description || !departmentId) {
      return res.status(400).json({
        success: false,
        message:
          "Name, code, description and departmentId are required",
      });
    }

    // Check duplicate service code
    const existingService = await Service.findOne({ code });

    if (existingService) {
      return res.status(409).json({
        success: false,
        message: "Service code already exists",
      });
    }

    // Validate verification types
    if (
      requiredVerifications &&
      !Array.isArray(requiredVerifications)
    ) {
      return res.status(400).json({
        success: false,
        message: "requiredVerifications must be an array",
      });
    }

    if (
      requiredVerifications &&
      !requiredVerifications.every((item) =>
        allowedVerifications.includes(item)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification type",
      });
    }

    // Check department exists
    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // Create service
    const service = await Service.create({
      name,
      code,
      description,
      departmentId,
      requiredDocuments:
        requiredDocuments || [],
      requiredVerifications:
        requiredVerifications || [],
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create service error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all services
const getServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("departmentId", "name code")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Get services error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get Service By ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("departmentId", "name code");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Get service error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update Service
const updateService = async (req, res) => {
  try {
    console.log("UPDATE REQUEST BODY:", req.body);

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const {
      name,
      description,
      requiredDocuments,
      requiredVerifications,
      isActive,
    } = req.body;

    if (name !== undefined) {
      service.name = name;
    }

    if (description !== undefined) {
      service.description = description;
    }

    if (requiredDocuments !== undefined) {
      service.requiredDocuments = requiredDocuments;
    }

    // Validate and update verification types
    if (requiredVerifications !== undefined) {
      if (!Array.isArray(requiredVerifications)) {
        return res.status(400).json({
          success: false,
          message:
            "requiredVerifications must be an array",
        });
      }

      if (
        !requiredVerifications.every((item) =>
          allowedVerifications.includes(item)
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid verification type",
        });
      }

      service.requiredVerifications =
        requiredVerifications;
    }

    if (isActive !== undefined) {
      service.isActive = isActive;
    }

    await service.save();

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Update service error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
};