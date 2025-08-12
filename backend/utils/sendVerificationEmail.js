const nodemailer = require("nodemailer");
require("dotenv").config();

const sendVerificationEmail = async (to, code) => {
  console.log("transporter");
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS, code);
  console.log("transporter created....transporter.sendEmail is nexr");
  await transporter.sendMail({
    from: `"Care Connect" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Verification Code",
    text: `Your verification code is ${code}`,
    html: `<p>Your verification code is <strong>${code}</strong></p>`,
  });
  console.log("transporter Email sent!");
};

module.exports = sendVerificationEmail;
