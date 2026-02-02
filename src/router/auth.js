const express = require('express');
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");

// ======================= SIGNUP =======================
authRouter.post("/signup", async (req, res) => {
  try {
    // 1. Validate data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Create user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();

    // Note: It's often good practice to send back a token immediately on signup, 
    // or just the success message.

    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production
      maxAge: 3600000,
      sameSite: "lax",
    });

    res.status(201).json({
      message: "User created successfully ✅",
      user: savedUser
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// ======================= LOGIN =======================
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Validate email
    if (!emailId || !validator.isEmail(emailId)) {
      throw new Error("Invalid credentials");
    }

    // Find user
    const user = await User.findOne({ emailId }).select("+password");
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Compare password (ASYNC NOW)
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT
    const token = user.getJWT();

    if (!token) {
      throw new Error("Token generation failed");
    }

    // Store cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
      sameSite: "lax", // ⬅️ better for dev
    });

    // ✅ SEND JSON (IMPORTANT)
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        _id: user._id
      },
      token // sending token in body as well is often helpful for non-browser clients
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// ======================= LOGOUT =======================
authRouter.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", null, {
      expire: new Date(Date.now()),
    });
    res.status(200).send("Logout successful");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = authRouter;