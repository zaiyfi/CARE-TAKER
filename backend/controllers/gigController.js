const Gig = require("../models/gigSchema");
const User = require("../models/userSchema");
const cloudinary = require("../cloudinaryConfig");

const sendApplication = async (req, res) => {
  const { name, description, category, hourlyRate, experience, location } =
    req.body;
  const user = await User.findOne({ _id: req.user._id });

  try {
    // Upload CV and Image to Cloudinary
    console.log(req.body);

    console.log(req.files);
    console.log("cloudinary start");
    const cvUpload = req.files["cv"]
      ? await cloudinary.uploader.upload(req.files["cv"][0].path, {
          folder: "MarketPlace/CVs",
        })
      : null;

    const imageUpload = req.files["image"]
      ? await cloudinary.uploader.upload(req.files["image"][0].path, {
          folder: "MarketPlace/Images",
        })
      : null;
    console.log("ENDED!");

    console.log(imageUpload.secure_url, cvUpload.secure_url);
    // Create Gig with uploaded URLs
    const gig = await Gig.create({
      name,
      description,
      hourlyRate,
      experience,
      category,
      location,
      cv: cvUpload ? cvUpload.secure_url : null,
      image: imageUpload ? imageUpload.secure_url : null,
      applicantId: user._id,
      applicantName: user.name,
      applicantEmail: user.email,
    });
    console.log("GIg Created");
    res.status(200).json(gig);
  } catch (error) {
    res.status(400).json({ error: "Gig is not created!" });
  }
};

const uploadImage = async (req, res) => {
  const image = req.file.path;
  const { _id } = req.params;
  try {
    // Uploading Image to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: "MarketPlace",
    });
    await Gig.findOneAndUpdate(
      { _id },
      { $push: { images: result.secure_url } }
    );
    res.status(200).json(result.secure_url);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Getting all Gigs
const getGigs = async (req, res) => {
  try {
    const gigs = await Gig.find()
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "reviews.user",
        model: "User",
        select: "name pic",
      });
    res.status(200).json(gigs);
  } catch (error) {
    res.status(404).json({ error: "No Such Product Exists!" });
  }
};

// Getting Gig regarding to user id
const getUserGigs = async (req, res) => {
  const user_id = req.user._id;
  try {
    console.log("Finding Gig");
    const gigs = await Gig.find({ applicantId: user_id }).sort({
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

// Adding reviews to products
const addReview = async (req, res) => {
  const { user, comment, rating } = req.body;
  const { productId } = req.params;

  try {
    console.log(productId);
    console.log({ user, comment, rating });

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Add the review to the product's reviews array
    product.reviews.push({ user, comment, rating });

    // Save the updated product
    await product.save();

    await product.populate({
      path: "reviews.user",
      model: "User",
      select: "name pic",
    });

    res.status(201).json(product);
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
  uploadImage,
  getGigs,
  getUserGigs,
  updateGig,
  deleteGig,
  deleteProductImage,
  addReview,
  dynamicCategory,
};
