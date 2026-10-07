const Document = require("../models/Document");
const Application = require("../models/Application");

const uploadDocument = async (req, res) => {
  try {
    const { applicationId, documentType } = req.body;

    if (!applicationId || !documentType) {
      return res.status(400).json({
        success: false,
        message: "applicationId and documentType are required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Document file is required"
      });
    }

    // Check application ownership
    const application = await Application.findOne({
      _id: applicationId,
      userId: req.user.userId
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    const document = await Document.create({
      applicationId,
      userId: req.user.userId,
      documentType,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      fileSize: req.file.size
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: {
        id: document._id,
        documentType: document.documentType,
        originalName: document.originalName,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
        verificationStatus: document.verificationStatus
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    const application = await Application.findById(
      document.applicationId
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    const currentUserId = req.user.userId.toString();

    // Citizen can access only their own document
    if (
      req.user.role === "citizen" &&
      document.userId.toString() !== currentUserId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Officer can access only assigned applications
    if (
      req.user.role === "government_officer" &&
      (!application.assignedOfficerId ||
        application.assignedOfficerId.toString() !== currentUserId)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    return res.status(200).json({
      success: true,
      document: {
        id: document._id,
        applicationId: document.applicationId,
        documentType: document.documentType,
        originalName: document.originalName,
        fileName: document.fileName,
        filePath: document.filePath,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
        verificationStatus: document.verificationStatus,
        remarks: document.remarks
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const getApplicationDocuments = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findOne({
      _id: applicationId,
      userId: req.user.userId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const documents = await Document.find({
      applicationId,
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
  getDocumentById,
  getApplicationDocuments,
};