const Verification = require("../models/verificationSchema");
const cloudinary = require("../cloudinaryConfig");

const submitVerification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { caregiverType } = req.body;

    // File upload via req.files
    const files = req.files;

    if (
      !caregiverType ||
      !files?.cnicFront ||
      !files?.cnicBack ||
      !files?.selfieWithCnic
    ) {
      return res
        .status(400)
        .json({ error: "Required fields or files are missing." });
    }

    // Upload to Cloudinary
    const cnicFrontUpload = await cloudinary.uploader.upload(
      files["cnicFront"][0].path,
      {
        folder: "MarketPlace/Verification",
      }
    );

    const cnicBackUpload = await cloudinary.uploader.upload(
      files["cnicBack"][0].path,
      {
        folder: "MarketPlace/Verification",
      }
    );

    const selfieUpload = await cloudinary.uploader.upload(
      files["selfieWithCnic"][0].path,
      {
        folder: "MarketPlace/Verification",
      }
    );

    const certificateUpload = files["certificate"]
      ? await cloudinary.uploader.upload(files["certificate"][0].path, {
          folder: "MarketPlace/Verification",
        })
      : null;

    // Check if user already submitted
    let verification = await Verification.findOne({ user: userId });

    if (verification) {
      // Update existing submission
      verification.caregiverType = caregiverType;
      verification.cnicFront = cnicFrontUpload.secure_url;
      verification.cnicBack = cnicBackUpload.secure_url;
      verification.selfieWithCnic = selfieUpload.secure_url;
      verification.certificate = certificateUpload?.secure_url || "";
      verification.status = "Pending";
      verification.submittedAt = new Date();
    } else {
      verification = new Verification({
        user: userId,
        caregiverType,
        cnicFront: cnicFrontUpload.secure_url,
        cnicBack: cnicBackUpload.secure_url,
        selfieWithCnic: selfieUpload.secure_url,
        certificate: certificateUpload?.secure_url || "",
      });
    }

    await verification.save();
    res.status(200).json({ message: "Verification submitted successfully." });
  } catch (err) {
    console.error("Verification submission error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  submitVerification,
};
