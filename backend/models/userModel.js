const bcrypt = require("bcrypt");
const validator = require("validator");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    publicId: {
      type: String,
    },
  },
  { timestamps: true }
);

// Signup Validation
userSchema.statics.signup = async function (
  name,
  email,
  password,
  role,
  pic,
  publicId
) {
  if (!name || !email || !password || !role) {
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

  const user = await this.create({
    name,
    email,
    password: hash,
    role,
    pic,
    publicId,
  });
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

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Invalid Credentials!");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
