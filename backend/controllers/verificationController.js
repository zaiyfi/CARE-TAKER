const Verification = require("../models/verificationSchema");
const User = require("../models/userSchema");

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

const getMyVerificationInfo = async (req, res) => {
  try {
    const data = await Verification.findOne({ user: req.user._id });
    if (!data) return res.status(404).json({ error: "No verification found" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const updateVerification = async (req, res) => {
  try {
    console.log("Updating verification for user:", req.user._id);

    const userId = req.user._id;

    // Find existing record
    const verification = await Verification.findOne({ user: userId });
    if (!verification) {
      return res.status(404).json({ error: "No verification record found." });
    }

    const updatedData = {
      caregiverType: req.body.caregiverType || verification.caregiverType,
    };

    // Upload files if provided
    const uploadIfExists = async (fileKey, folder) => {
      if (req.files && req.files[fileKey]) {
        const result = await cloudinary.uploader.upload(
          req.files[fileKey][0].path,
          {
            folder: `CareTaker/Verification/${fileKey}`,
          }
        );
        return result.secure_url;
      }
      return verification[fileKey]; // keep existing one if not updated
    };

    // Upload files and update URLs
    updatedData.cnicFront = await uploadIfExists("cnicFront", "cnic");
    updatedData.cnicBack = await uploadIfExists("cnicBack", "cnic");
    updatedData.selfieWithCnic = await uploadIfExists(
      "selfieWithCnic",
      "selfies"
    );
    updatedData.certificate = await uploadIfExists(
      "certificate",
      "certificates"
    );

    // Update the record
    const updatedVerification = await Verification.findOneAndUpdate(
      { user: userId },
      updatedData,
      { new: true }
    );
    console.log("Updated verification:", updatedVerification);
    console.log("Verification updated successfully:", updatedData);
    res.status(200).json(updatedVerification);
  } catch (error) {
    console.error("Update verification error:", error);
    res.status(500).json({ error: "Failed to update verification." });
  }
};

// Get pending verifications for admin
const getPendingVerifications = async (req, res) => {
  try {
    const pendingVerifications = await Verification.find({ status: "Pending" })
      .populate("user", "name email cellNo") // populate selected user fields
      .sort({ submittedAt: -1 }); // latest first

    res.status(200).json(pendingVerifications);
  } catch (err) {
    console.error("Error fetching pending verifications:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Update verification status by admin
const updateVerificationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log("started updating verification status for ID:", id);

  try {
    const updated = await Verification.findByIdAndUpdate(
      id,
      {
        status,
        adminRemarks: "",
        reviewedAt: new Date(),
      },
      { new: true }
    ).populate("user", "name email");

    if (!updated) {
      return res.status(404).json({ error: "Verification not found" });
    }
    if (updated) {
      await User.findByIdAndUpdate(
        updated.user,
        { verificationStatus: status },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: `Verification ${status}`, updated });
    }
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  submitVerification,
  getMyVerificationInfo,
  updateVerification,
  getPendingVerifications,
  updateVerificationStatus,
};
