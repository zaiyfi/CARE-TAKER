const requireAuth = require("../middleware/requireAuth");

// Importing the required components
const upload = require("../middleware/uploadImage");
const {
  sendApplication,
  uploadImage,
  getGigs,
  getUserGigs,
  updateGig,
  deleteGig,
  deleteProductImage,
  addReview,
  dynamicCategory,
} = require("../controllers/gigController");

// setting the router
const router = require("express").Router();

// Checking Whether user in logged in or not

// Create/Update Products
router.post(
  "/send",
  requireAuth,
  upload.fields([{ name: "cv" }, { name: "image" }]),
  sendApplication
);

router.patch("/update/:_id", requireAuth, updateGig);
router.patch("/addReview/:gigId", requireAuth, addReview);

// // Get Single/All Products
router.get("/get-gigs", getGigs);
router.get("/user-gigs", requireAuth, getUserGigs);
router.get("/categories", dynamicCategory);

// Delete Products
// router.delete(
//   "/deleteImage/:productId/:imageIndex",
//   requireAuth,
//   deleteProductImage
// );
router.delete("/delete/:_id", requireAuth, deleteGig);

// // Image Upload Route
// router.patch("/upload/:_id", requireAuth, upload.single("file"), uploadImage);

module.exports = router;
