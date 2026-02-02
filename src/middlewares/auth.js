const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please Login!");
    }

    const decodedObj = jwt.verify(token, "SecretKey@12D3");
    const { userId } = decodedObj;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).send("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Invalid or expired token");
  }
};

module.exports = { userAuth };

