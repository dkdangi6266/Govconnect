const express = require("express");

const router = express.Router();

const {
  getAuditLogs
} = require("../controllers/auditController");

const {
  authenticate,
  authorize
} = require("../middleware/authMiddleware");

router.get(
  "/",
  authenticate,
  authorize("super_admin"),
  getAuditLogs
);

module.exports = router;