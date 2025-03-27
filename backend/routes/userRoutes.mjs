import express from "express";
import upload from "../middleware/uploadMiddleware.mjs";
import authMiddleware from "../middleware/authMiddleware.mjs"; // Import the auth middleware
import User from "../models/User.mjs";

const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Ensure req.user is populated by authMiddleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      profileImage: user.profileImage, // Include the profile image URL
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/upload-profile-image", authMiddleware, upload.single("profileImage"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  try {
    const userId = req.user.id; // Ensure req.user is populated by authMiddleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profileImage = imageUrl; // Save the image URL to the user's profile
    await user.save();

    res.status(200).json({ imageUrl });
  } catch (err) {
    console.error("Error updating profile image:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add this route for updating the user's name and email
router.put("/profile", authMiddleware, async (req, res) => {
  const { name, email } = req.body;

  try {
    const userId = req.user.id; // Ensure req.user is populated by authMiddleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's name and email
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
