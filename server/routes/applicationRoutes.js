const express = require("express");

const router = express.Router();

const {
  createApplication,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
  getOfficerApplications,
  assignApplication
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
router.get(
  "/officer",
  authenticate,
  authorize(
    "government_officer",
    "department_admin",
    "super_admin"
  ),
  getOfficerApplications
);
router.post(
  "/:id/assign",
  authenticate,
  authorize("super_admin", "department_admin"),
  assignApplication
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