const Department = require("../models/Department");

const createDepartment = async (req, res) => {
  try {
    const { name, code, description } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Name and code are required"
      });
    }

    const existingDepartment = await Department.findOne({
      $or: [{ name }, { code: code.toUpperCase() }]
    });

    if (existingDepartment) {
      return res.status(409).json({
        success: false,
        message: "Department already exists"
      });
    }

    const department = await Department.create({
      name,
      code,
      description
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      department
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({
      isActive: true
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: departments.length,
      departments
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


module.exports = {
  createDepartment,
  getDepartments
};