const express = require("express");

const router = express.Router();

const {
  createOfficer,
  getOfficers
} = require("../controllers/officerController");

const {
  authenticate,
  authorize
} = require("../middleware/authMiddleware");

router.post(
  "/",
  authenticate,
  authorize("super_admin"),
  createOfficer
);
router.post(
  "/",
  authenticate,
  authorize("super_admin"),
  createOfficer
);

router.get(
  "/",
  authenticate,
  authorize("super_admin", "department_admin"),
  getOfficers
);

module.exports = router;