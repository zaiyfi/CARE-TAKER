const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cloudinary = require("../cloudinaryConfig");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

//    ------ Signup Controller -------
const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const pic = req.file?.path;

  try {
    console.log(pic);
    let picUrl, publicId;

    const imageCloud = await cloudinary.uploader.upload(pic, {
      folder: "AppointmentBooking",
    });
    picUrl = imageCloud.secure_url;
    publicId = imageCloud.public_id;
    const user = await User.signup(
      name,
      email,
      password,
      role,
      picUrl,
      publicId
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//    ------ Login Controller -------
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = await createToken(user._id);
    const newUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      pic: user.pic,
      token,
    };

    res.status(200).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = { signup, login };
