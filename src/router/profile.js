const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");

const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");

// ================= VIEW PROFILE =================
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// ================= EDIT PROFILE =================
profileRouter.put("/profile/edit", userAuth, async (req, res) => {
  try {
    // 1️⃣ Validate request body
    validateEditProfileData(req);

    // 2️⃣ Update logged-in user
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    res.json({ message: `${loggedInUser.firstName}, Your profile updated successfully!` });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});


// ================= CHANGE PASSWORD =================
profileRouter.put("/profile/change-password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    console.log("🔑 Current Password (input):", currentPassword);
    console.log("🆕 New Password (input):", newPassword);

    if (!currentPassword || !newPassword) {
      return res.status(400).send("Both passwords are required");
    }

    // Explicitly fetch password
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).send("User not found");
    }

    // ✅ Correct password check
    const isMatch = await user.comparePassword(currentPassword);
    console.log("🔍 bcrypt compare result:", isMatch);
    
    if (!isMatch) {
      return res.status(401).send("Current password is incorrect");
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).send("Password is too weak");
    }

    if (currentPassword === newPassword) {
      return res.status(400).send("New password cannot be the same as current password");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.send("Password changed successfully 🔐");
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).send("Internal Server Error");
  }
});


// DEBUG: Temporary Force Reset Route
profileRouter.put("/profile/force-password-reset", userAuth, async (req, res) => {
  try {
    console.log("FORCE RESET PASSWORD CALLED");
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).send("New password required");

    const user = await User.findById(req.user._id);
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();

    console.log("Password forcibly updated for user:", user._id);
    res.json({ message: "Password forcibly updated", success: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = profileRouter;