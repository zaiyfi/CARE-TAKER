const User = require("../models/userSchema");
const Gig = require("../models/gigSchema");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const EmailOtp = require("../models/otpSchema");
const crypto = require("crypto");
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
// STEP 1: Request Email & Send Verification Code
const requestEmailVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    console.log("existing user");
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    console.log("otp");
    // Generate code
    const code = crypto.randomInt(100000, 999999).toString();

    console.log("crypto worked!");
    // Save in DB for verification
    await EmailOtp.findOneAndUpdate(
      { email },
      { otp: code, createdAt: new Date() },
      { upsert: true, new: true }
    );
    console.log("email otp");

    // Send email
    await sendVerificationEmail(email, code);

    res.status(200).json({ message: "Verification code sent to email" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send verification email" });
  }
};

// STEP 2: Verify Email & Proceed to Full Registration
const verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;
  console.log(email, code);
  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }

  try {
    const record = await EmailOtp.findOne({ email });
    console.log("founded email");

    if (!record) {
      return res.status(400).json({ error: "No verification request found" });
    }

    if (record.otp !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }
    console.log("code matched");
    await User.findOneAndUpdate(
      { email },
      { $set: { isEmailVerified: true } },
      { new: true }
    );
    // Success — allow frontend to proceed to the next registration step
    res
      .status(200)
      .json({ verified: true, message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ error: "Verification failed" });
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
    console.log("starting to update user location");
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
    console.log("user location Updated");
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
    const gigCreators = await Gig.distinct("applicant");

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

// Get Admin Details
const getAdminDetails = async (req, res) => {
  try {
    // If your admin is stored in DB with a known role
    const admin = await User.findOne({ role: "Admin" }).select(
      "name email cellNo role createdAt"
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // You can also add extra static info here for the contact page
    const responseData = {
      name: admin.name,
      email: admin.email,
      phone: admin.cellNo,
      role: admin.role,
      supportHours: {
        weekdays: "Mon–Fri: 9 AM to 6 PM",
        weekends: "Closed",
        avgResponse: "Replies within 24 hours",
      },
      faq: [
        {
          question: "How do I contact support?",
          answer: "You can email us directly or use the help form on our site.",
        },
        {
          question: "What issues can I report?",
          answer:
            "Anything related to account, payments, or technical problems.",
        },
        {
          question: "Do you offer phone support?",
          answer: "Currently, we only offer email support.",
        },
      ],
      notice:
        "⚠️ The admin will never ask for your password or payment details.",
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching admin details:", error);
    res.status(500).json({ message: "Server error" });
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
  getAdminDetails,
  requestEmailVerification,
  verifyEmailCode,
};
