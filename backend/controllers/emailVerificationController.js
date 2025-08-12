const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const nodemailer = require("nodemailer");

const createToken = (payload, expiresIn) => {
  return jwt.sign(payload, process.env.SECRET, { expiresIn });
};

// Step 1: Request Email Verification
const requestEmailVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    // Check if already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create token valid for 15 mins
    const token = createToken({ email }, "15m");

    // Send email (example using nodemailer)
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    await transporter.sendMail({
      from: `"Marketplace" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Click below to verify your email:</p><a href="${verificationLink}">${verificationLink}</a>`,
    });

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Error sending verification email" });
  }
};

// Step 2: Verify Email Token
const verifyEmailToken = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    res.status(200).json({ message: "Email verified", email: decoded.email });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Step 3: Complete Registration
const completeRegistration = async (req, res) => {
  const { name, email, cellNo, role, password } = req.body;

  try {
    await User.register(name, email, cellNo, role, password);
    res.status(200).json({ message: "Registration complete" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  requestEmailVerification,
  verifyEmailToken,
  completeRegistration,
};
