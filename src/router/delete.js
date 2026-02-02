const express = require("express");
const deleteRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

// ======================= DELETE USER =======================
deleteRouter.delete("/deleteUser", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.clearCookie("token"); // logout user
    res.json({ message: "User deleted successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

module.exports = deleteRouter;
