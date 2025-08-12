const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

// importing controller functions
const {
  register,
  login,
  getUsers,
  updateUser,
  getUser,
  viewedProducts,
  updateImg,
  updateUserLocation,
  getNearbyUsers,
  getAdminDetails,
  requestEmailVerification,
  verifyEmailCode,
} = require("../controllers/authController");
const upload = require("../middleware/uploadImage");

// Setting up Auth Routes

// Step 1: Email verification request
router.post("/send-email-otp", requestEmailVerification);

// Step 2: Email verification check
router.post("/verify-email-otp", verifyEmailCode);

// Step 3: Full registration (same as before, but only after step 2)
router.post("/register", register);
router.post("/login", login);

// Update User Image
router.patch(
  "/image/upload/:user_id",
  requireAuth,
  upload.single("file"),
  updateImg
);

// Add product to viewedProduct
router.patch("/viewGig/:product_id/:user_id", requireAuth, viewedProducts);

// Get All Users
router.get("/users", getUsers);
router.get("/user/:user_id", getUser);
router.get("/admin/details", getAdminDetails);

// Update user status By ADMIN
router.patch("/update/:user_id", updateUser);
router.put("/:id/location", updateUserLocation);

// Nearby
router.post("/nearby", getNearbyUsers);

// Exporting
module.exports = router;
