const express = require("express");
const dataRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

// ======================= GET ALL USERS =======================
dataRouter.get("/getAllData", userAuth, async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Don't return passwords!
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching data: " + err.message });
  }
});

module.exports = dataRouter;