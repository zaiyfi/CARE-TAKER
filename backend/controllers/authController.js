const User = require("../models/userSchema");
const Gig = require("../models/gigSchema");
const cloudinary = require("../cloudinaryConfig");

const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Register Controller
const register = async (req, res) => {
  const { name, email, cellNo, role, password } = req.body;
  let emptyFields = [];
  if (!name) {
    emptyFields.push("name");
  }
  if (!email) {
    emptyFields.push("email");
  }
  if (!password) {
    emptyFields.push("password");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }
  try {
    await User.register(name, email, cellNo, role, password);
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user } = await User.login(email, password);
    // Createing Token
    const token = createToken(user._id);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Getting all Users Data

const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
// Get Specific User
const getUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await User.findOne({ _id: user_id });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Updating user status
const updateUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    console.log("UPDATING USER " + user_id);
    const user = await User.findOneAndUpdate(
      { _id: user_id },
      { ...req.body },
      { new: true }
    );
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: "User can't be found!" });
  }
};

// updating user img

const updateImg = async (req, res) => {
  const image = req.file.path;
  const { user_id } = req.params;

  try {
    // Uploading Image to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: "MarketPlace/user",
    });
    const update = await User.findByIdAndUpdate(
      user_id,
      {
        pic: result.secure_url,
        pocPublicId: result.public_id,
      },
      { new: true }
    );
    await res.status(200).json(result.secure_url);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Adding products to users viewedProducts field and adding view to product
const viewedProducts = async (req, res) => {
  const { product_id, user_id } = req.params;

  try {
    const user = await User.findById(user_id);

    if (!user.viewedProducts.includes(product_id)) {
      const gig = await Gig.findByIdAndUpdate(
        product_id,
        { $inc: { views: 1 } }, // Increment views by 1
        { new: true } // Return the updated document
      );
      console.log("product viewed");

      if (!gig) {
        res.status(404).json("Product Not Found!");
      }

      user.viewedProducts.push(product_id);
      await user.save();
      res.status(200).json("View Added");
    } else {
      res.status(200).json("Gig Already Viewed");
      console.log("Gig already viewed!");
    }
  } catch (error) {
    console.error("Error in viewedProducts:", error);
    res.status(500).json("Internal Server Error!");
  }
};

const updateUserLocation = async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        },
      },
      { new: true } // ensure updated document is returned
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Location updated for user:", updatedUser.location); // debug
    res.status(200).json({ message: "Location updated", user: updatedUser });
  } catch (error) {
    console.error("❌ Error updating location:", error);
    res.status(500).json({ message: "Server error while updating location." });
  }
};

const getNearbyUsers = async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    // Step 1: Find all user IDs who have created a gig
    const gigCreators = await Gig.distinct("applicantId");

    // Step 2: Query users within 5 km who are also gig creators
    const users = await User.find({
      _id: { $in: gigCreators },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 5000, // 5 km
        },
      },
    }).select("_id name role location");

    res.json({ users });
    console.log("Nearby users fetched successfully:", users);
  } catch (err) {
    console.error("Geo query failed:", err);
    res.status(500).json({ message: "Failed to fetch nearby users" });
  }
};

module.exports = {
  register,
  login,
  getUsers,
  updateUser,
  getUser,
  viewedProducts,
  updateImg,
  updateUserLocation,
  getNearbyUsers,
};
