const express = require("express");

const router = express.Router();

const {
  createOfficer
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

module.exports = router;