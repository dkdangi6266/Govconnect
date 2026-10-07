const express = require("express");

const router = express.Router();
const {
  uploadDocument,
  getDocumentById,
  getApplicationDocuments,
} = require("../controllers/documentController");

const {
  authenticate
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

router.post(
  "/upload",
  authenticate,
  (req, res, next) => {
    upload.single("document")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      next();
    });
  },
  uploadDocument
);
router.get(
  "/application/:applicationId",
  authenticate,
  getApplicationDocuments
);
module.exports = router;