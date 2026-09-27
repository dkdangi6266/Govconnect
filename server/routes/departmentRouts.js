const express = require("express");

const router = express.Router();

const {
  createDepartment,
  getDepartments
} = require("../controllers/departmentController");

const {
  authenticate,
  authorize
} = require("../middleware/authMiddleware");

// Super Admin only
router.post(
  "/",
  authenticate,
  authorize("super_admin"),
  createDepartment
);

// Logged-in users can see active departments
router.get(
  "/",
  authenticate,
  getDepartments
);

module.exports = router;