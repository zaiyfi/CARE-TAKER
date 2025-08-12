const express = require("express");
const router = express.Router();

const {
  requestEmailVerification,
  verifyEmailToken,
  completeRegistration,
} = require("../controllers/emailVerificationController");

// Step 1: Request verification
router.post("/verify-email", requestEmailVerification);

// Step 2: Verify the token
router.get("/verify-email/:token", verifyEmailToken);

// Step 3: Complete registration after verification
router.post("/register", completeRegistration);

module.exports = router;
