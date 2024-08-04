const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

async function getDataFromToken(token) {
  if (!token) {
    return {
      message: "session timed out",
      logout: true,
    };
  }
  const decode = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decode.id).select("-password");
  return user;
}

module.exports = getDataFromToken;
