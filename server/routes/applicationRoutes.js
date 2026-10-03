const express = require("express");

const router = express.Router();

const {
  createApplication,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus
} = require("../controllers/applicationController");

const {
  authenticate,
  authorize
} = require("../middleware/authMiddleware");

// Create application
router.post(
  "/",
  authenticate,
  createApplication
);

// Get my applications
router.get(
  "/my",
  authenticate,
  getMyApplications
);

// Update application status
router.patch(
  "/:id/status",
  authenticate,
  authorize(
    "super_admin",
    "department_admin",
    "government_officer"
  ),
  updateApplicationStatus
);

// Get single application
router.get(
  "/:id",
  authenticate,
  getApplicationById
);

module.exports = router;