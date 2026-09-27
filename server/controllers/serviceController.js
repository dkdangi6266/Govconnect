const Service = require("../models/Service");

// Create Service
const createService = async (req, res) => {
  try {
    const { name, code, description, departmentId, requiredDocuments } =
      req.body;

    // Check required fields
    if (!name || !code || !description || !departmentId) {
      return res.status(400).json({
        success: false,
        message: "Name, code, description and departmentId are required"
      });
    }

    // Check duplicate service code
    const existingService = await Service.findOne({ code });

    if (existingService) {
      return res.status(409).json({
        success: false,
        message: "Service code already exists"
      });
    }

    // Create service
    const service = await Service.create({
      name,
      code,
      description,
      departmentId,
      requiredDocuments: requiredDocuments || []
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service
    });

  } catch (error) {
    console.error("Create service error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// Get all services
const getServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("departmentId", "name code")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });

  } catch (error) {
    console.error("Get services error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


module.exports = {
  createService,
  getServices
};