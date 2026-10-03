const express = require("express");

const router = express.Router();

const {
  grantConsent,
  getMyConsents,
  revokeConsent
} = require("../controllers/consentController");

const {
  authenticate
} = require("../middleware/authMiddleware");

// Grant consent
router.post(
  "/",
  authenticate,
  grantConsent
);

// Get my consents
router.get(
  "/my",
  authenticate,
  getMyConsents
);

// Revoke consent
router.patch(
  "/:id/revoke",
  authenticate,
  revokeConsent
);

module.exports = router;