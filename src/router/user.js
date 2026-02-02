const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
/*
userRouter.js
- GET /profile/requests - Gets all the pending connection requests for the logged-in user
- GET /profile/connections
- GET /user/feed - Gets you the profile of other users on platform to connect with them (Excludes users already connected or with pending requests)
*/

// Get all the pending connection requests for the logged-in user
userRouter.get("/profile/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userSafeData = "firstName lastName createdAt updatedAt";
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", userSafeData);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/profile/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userSafeData = "firstName lastName createdAt updatedAt";

    const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    })
      .populate("fromUserId", userSafeData)
      .populate("toUserId", userSafeData);

    const data = connections.map((connection) => {
      // tostring to compare ObjectIds - it's safer to use equals method
      if (connection.fromUserId._id.equals(loggedInUser._id)) {
        return connection.toUserId;   // other person
      } else {
        return connection.fromUserId; // other person
      }
    });

    res.json({
      message: "Connections fetched successfully",
      data,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userSafeData = "firstName lastName photoUrl about skills";

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    let limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    hideUserFromFeed.add(loggedInUser._id.toString());

    connectionRequests.forEach((request) => {
      hideUserFromFeed.add(request.fromUserId.toString());
      hideUserFromFeed.add(request.toUserId.toString());
    });

    const excludedUserIds = Array.from(hideUserFromFeed);

    const [users, totalUsers] = await Promise.all([
      User.find({ _id: { $nin: excludedUserIds } })
        .select(userSafeData)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      User.countDocuments({ _id: { $nin: excludedUserIds } })
    ]);

    res.json({
      message: "User feed fetched successfully",
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      data: users
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = userRouter;

// Get user feed excluding already connected users and pending requests
// before that explore connection requests where logged in user is either fromUserId or toUserId
// collect all those userIds in a set to hide from feed
// finally query users excluding those in the set and also excluding logged in user

/*
Pagination validation

Limit capping

Excluding self & connections

Duplicate prevention using Set

Sorting

Total count for frontend pagination

Index optimization

🔥 That’s strong backend thinking.
*/

// we need to know about query components like $nin, $ne, $or, $and
/*

  - nin: not in an array - $nin: [array of values]  - excludes those values
  - ne: not equal to - $ne: value  - excludes that value
  - or: logical OR - $or: [ {condition1}, {condition2} ]
  - and: logical AND - $and: [ {condition1}, {condition2} ]

  Example:
  db.users.find({
    $and: [
      { age: { $nin: [25, 30, 35] } },  // age not in 25, 30, 35
      { status: { $ne: "inactive" } }   // status not equal to inactive
    ]
  })

*/