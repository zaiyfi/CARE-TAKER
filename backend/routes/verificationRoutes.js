const express = require("express");
const router = express.Router();
const {
  submitVerification,
  getMyVerificationInfo,
  updateVerification,
  getPendingVerifications,
  updateVerificationStatus,
} = require("../controllers/verificationController");
const requireAuth = require("../middleware/requireAuth");
const upload = require("../middleware/uploadImage"); // Your multer config

// Handles multiple file uploads
router.post(
  "/",
  requireAuth,
  upload.fields([
    { name: "cnicFront", maxCount: 1 },
    { name: "cnicBack", maxCount: 1 },
    { name: "selfieWithCnic", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  submitVerification
);
// routes/verifyRoutes.js
router.get("/me", requireAuth, getMyVerificationInfo);

// Update verification info
router.patch(
  "/edit",
  requireAuth,
  upload.fields([
    { name: "cnicFront", maxCount: 1 },
    { name: "cnicBack", maxCount: 1 },
    { name: "selfieWithCnic", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  updateVerification
);
// Update verification status by admin
router.patch("/status/:id", requireAuth, updateVerificationStatus);

// Get pending verifications
router.get("/pending", requireAuth, getPendingVerifications);
module.exports = router;
