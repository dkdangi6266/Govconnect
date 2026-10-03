const express = require("express");

const router = express.Router();

const {
  verifyIdentity,
  verifyIncome,
  verifyEducation,
  verifyResidence,
  verifyApplication
} = require("../controllers/integrationController");

const {
  authenticate
} = require("../middleware/authMiddleware");

router.get(
  "/identity/:userId",
  authenticate,
  verifyIdentity
);

router.get(
  "/income/:userId",
  authenticate,
  verifyIncome
);

router.get(
  "/education/:userId",
  authenticate,
  verifyEducation
);

router.get(
  "/residence/:userId",
  authenticate,
  verifyResidence
);
router.post(
  "/applications/:applicationId/verify",
  authenticate,
  verifyApplication
);
module.exports = router;