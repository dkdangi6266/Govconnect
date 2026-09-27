const express = require("express");

const router = express.Router();

const {
  createService,
  getServices,
  getServiceById,
  updateService
} = require("../controllers/serviceController");

const {
  authenticate,
  authorize
} = require("../middleware/authMiddleware");

// Get all services
router.get(
  "/",
  authenticate,
  getServices
);

// Get single service
router.get(
  "/:id",
  authenticate,
  getServiceById
);

// Create service
router.post(
  "/",
  authenticate,
  authorize("super_admin", "department_admin"),
  createService
);

// Update service
router.patch(
  "/:id",
  authenticate,
  authorize("super_admin", "department_admin"),
  updateService
);

module.exports = router;