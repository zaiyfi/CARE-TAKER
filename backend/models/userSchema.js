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
    password: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Active",
    },
    role: {
      type: String,
      default: "User",
    },

    favProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    viewedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

// Signup/Register Validation
userSchema.statics.register = async function (name, email, cellNo, password) {
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

  const user = await this.create({ name, email, cellNo, password: hash });
  return user;
};

// Login Validation
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All Fields are Required!");
  }

  const user = await this.findOne({ email });
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
