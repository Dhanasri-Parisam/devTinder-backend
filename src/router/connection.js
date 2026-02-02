const express = require("express");
const connectionRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

// ======================= SEND CONNECTION REQUEST =======================
connectionRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user; // Set by userAuth middleware
    console.log("Connection request sent by " + user.firstName);

    // TODO: Save connection request to DB when ConnectionRequest model is available

    res.json({
      message: `${user.firstName} Connection request sent (Simulated)`,
      success: true
    });
  }
  catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = connectionRouter;