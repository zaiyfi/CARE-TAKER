const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

// importing controller functions
const {
  register,
  login,
  getUsers,
  updateStatus,
  getUser,
  addFavProduct,
  viewedProducts,
  removeFavProduct,
  updateImg,
} = require("../controllers/authController");
const upload = require("../middleware/uploadImage");

// Setting up Auth Routes
router.post("/register", register);
router.post("/login", login);

// Add/Remove product to favourites
router.patch(
  "/remove/removeFavProducts/:user_id/:product_id",
  requireAuth,
  removeFavProduct
);
router.patch(
  "/addFavProducts/:user_id/:product_id",
  requireAuth,
  addFavProduct
);
// Update User Image
router.patch(
  "/image/upload/:user_id",
  requireAuth,
  upload.single("file"),
  updateImg
);

// Add product to viewedProduct
router.patch("/viewProducts/:product_id/:user_id", requireAuth, viewedProducts);

// Get All Users
router.get("/users", getUsers);
router.get("/user/:user_id", getUser);

// Update user status By ADMIN
router.patch("/update/:user_id", updateStatus);

// Exporting
module.exports = router;
