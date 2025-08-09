const Gig = require("../models/gigSchema");
const User = require("../models/userSchema");
const cloudinary = require("../cloudinaryConfig");

const sendApplication = async (req, res) => {
  const {
    name,
    description,
    category,
    hourlyRate,
    experience,
    location,
    availability,
  } = req.body;
  const user = await User.findOne({ _id: req.user._id });

  try {
    // Upload CV and Image to Cloudinary
    console.log("Files:", req.files);
    console.log("CV", req.files["cv"]);
    const cvUpload = req.files["cv"]
      ? await cloudinary.uploader.upload(req.files["cv"][0].path, {
          resource_type: "auto",
          folder: "MarketPlace/CVs",
        })
      : null;
    console.log("CV Upload:", cvUpload);
    const imageUpload = req.files["image"]
      ? await cloudinary.uploader.upload(req.files["image"][0].path, {
          folder: "MarketPlace/Images",
        })
      : null;

    const parsedAvailability = availability ? JSON.parse(availability) : [];

    const gig = await Gig.create({
      name,
      description,
      hourlyRate,
      experience,
      category,
      location,
      availability: parsedAvailability,
      cv: cvUpload ? cvUpload.secure_url : null,
      image: imageUpload ? imageUpload.secure_url : null,
      applicantId: user._id,
      applicantName: user.name,
      applicantEmail: user.email,
    });

    res.status(200).json(gig);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Gig is not created!" });
  }
};

// Getting all Gigs
const getGigs = async (req, res) => {
  try {
    const gigs = await Gig.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "applicant", // user who created the gig
        model: "User",
        select: "name pic email verificationStatus", // include verification status
      })
      .populate({
        path: "reviews.user", // users who left reviews
        model: "User",
        select: "name pic",
      });

    res.status(200).json(gigs);
  } catch (error) {
    console.error("Error fetching gigs:", error);
    res.status(404).json({ error: "No Such Product Exists!" });
  }
};

// Getting Gig regarding to user id
const getUserGigs = async (req, res) => {
  const user_id = req.user._id;
  try {
    console.log("Finding Gig");
    const gigs = await Gig.find({ applicant: user_id }).sort({
      createdAt: -1,
    });
    console.log("completed");
    res.status(200).json(gigs);
  } catch (error) {
    res.status(404).json({ error: "No Such Gig Exists!" });
  }
};

// Updating the Gig
const updateGig = async (req, res) => {
  const { _id } = req.params;
  try {
    const gig = await Gig.findOneAndUpdate(
      { _id },
      { ...req.body },
      { new: true }
    );

    res.status(200).json(gig);
  } catch (error) {
    res.status(404).json({ error: "No Such GIG Exists!" });
  }
};

// Deleting the GIG
const deleteGig = async (req, res) => {
  const { _id } = req.params;
  try {
    const gig = await Gig.findOneAndDelete({ _id });
    res.status(200).json(gig);
  } catch (error) {
    console.error("Error deleting gig:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Deleting Image of Specific Product
const deleteProductImage = async (req, res) => {
  const { productId, imageIndex } = req.params;
  try {
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({ error: "Product not found!" });
    }

    if (!product.images || !Array.isArray(product.images)) {
      return res.status(400).json({ error: "Product has no images" });
    }

    if (imageIndex >= 0) {
      // Remove the image from the product's images array
      product.images.splice(imageIndex, 1);

      // Save the updated product
      product.save();
      if (product.save()) {
        res.status(200).json({ message: "Image Deleted Successfully!" });
      }
    } else {
      return res.status(400).json({ error: "Invalid image index" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Adding reviews to Gig
const addReview = async (req, res) => {
  const { user, comment, rating } = req.body;
  const { gigId } = req.params;

  try {
    console.log(gigId);
    console.log({ user, comment, rating });

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Add the review to the product's reviews array
    gig.reviews.push({ user, comment, rating });

    // Save the updated product
    await gig.save();

    await gig.populate({
      path: "reviews.user",
      model: "User",
      select: "name pic",
    });

    res.status(201).json(gig);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//  Gig caetogories for filters
const dynamicCategory = async (req, res) => {
  try {
    const categories = await Gig.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  sendApplication,
  getGigs,
  getUserGigs,
  updateGig,
  deleteGig,
  deleteProductImage,
  addReview,
  dynamicCategory,
};
