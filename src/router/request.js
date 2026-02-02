const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

// ================= SEND CONNECTION REQUEST =================
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status.toLowerCase().trim();

      // Validate status - what if user other then interested or ignored
      const allowedStatuses = ["interested", "ignored"];
      if (!allowedStatuses.includes(status)) {
        return res
          .status(400)
          .json({ message: `Invalid status value provided: ${status}` });
      }

      // user does not exist in data database
      const userExists = await User.findById(toUserId);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }


      // Prevent sending request to self
      // poor way to check self-requests, better to use middleware - reference connectionRequest.js
      // if (fromUserId.toString() === toUserId) {
      //   return res
      //     .status(400)
      //     .json({ message: "You cannot send request to yourself" });
      // }

      // Prevent duplicate requests
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ]
      });

      if (existingRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already sent" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.status(201).json({
        message: `${req.user.firstName} sends Connection request to ${userExists.firstName} with status: ${status}`,
        data,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const { status, requestId } = req.params;

    const allowedStatuses = ["accepted", "rejected"];
    if (!allowedStatuses.includes(status.toLowerCase().trim())) {
      return res
        .status(400)
        .json({ message: `Invalid status value provided: ${status}` });
    }     

    // Check if connection request exists and is directed to the logged-in user
    // 1. Find the connection request by ID and toUserId
    // 2. Ensure the status is "interested"
    // 3. If not found, return an error response
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUserId._id,
      status: "interested"
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found or already reviewed" });
    }
    // Update the status of the connection request
    connectionRequest.status = status.toLowerCase().trim();
    const data = await connectionRequest.save();
    res.status(200).json({ message: `Connection request ${status.toLowerCase().trim()} successfully.`, data });
    console.log("connection accepted successfully" + data);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = requestRouter;

// thought process of Post vs Get
// POST is more appropriate here because:
// - Both endpoints modify server state (creating/updating connection requests)
// - Data is sent in request body, not exposed in URLs or logs
// - POST is idempotent-safe for sensitive operations like authentication-required actions
// - GET should only be used for retrieving data without side effects
