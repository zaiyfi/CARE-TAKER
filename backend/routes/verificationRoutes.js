const express = require("express");
const router = express.Router();
const { submitVerification } = require("../controllers/verificationController");
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

module.exports = router;
