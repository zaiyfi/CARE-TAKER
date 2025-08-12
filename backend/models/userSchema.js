const bcrypt = require("bcrypt");
const validator = require("validator");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    picPublicId: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
    cellNo: {
      type: String,
    },
    city: {
      type: String, // City name
      default: "", // Default to empty string
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    password: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Active",
    },

    verificationStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"],
    },
    role: {
      type: String,
      default: "Client",
      required: true,
      enum: ["Client", "Caregiver", "Admin"],
    },
    isEmailVerified: { type: Boolean, default: false },

    assignedClients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // if caregiver
    assignedCaregiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // if client

    viewedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);
userSchema.index({ location: "2dsphere" });

// Signup/Register Validation
userSchema.statics.register = async function (
  name,
  email,
  cellNo,
  role,
  password
) {
  if (!name || !email || !password) {
    throw Error("All Fields are Required!");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid!");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not Strong Enough!");
  }
  const exist = await this.findOne({ email });
  if (exist) {
    throw Error("Email is Already Registered");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ name, email, cellNo, role, password: hash });
  return user;
};

// Login Validation
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All Fields are Required!");
  }

  const user = await this.findOne({ email }).populate(
    "assignedCaregiver",
    "name email pic"
  );

  if (!user) {
    throw Error("Invalid Credentials!");
  }

  if (user.status !== "Active") {
    throw Error("This user has been blocked!");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Invalid Credentials!");
  }

  const user_id = user._id;
  return { user, user_id };
};

module.exports = mongoose.model("User", userSchema);
