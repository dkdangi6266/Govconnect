const express = require("express");

const router = express.Router();

const {
  createService,
  getServices
} = require("../controllers/serviceController");

const {
  authenticate,
  authorize
} = require("../middleware/authMiddleware");

// GET all services
router.get(
  "/",
  authenticate,
  getServices
);

// CREATE service
// Only Super Admin and Department Admin
router.post(
  "/",
  authenticate,
  authorize("super_admin", "department_admin"),
  createService
);

module.exports = router;