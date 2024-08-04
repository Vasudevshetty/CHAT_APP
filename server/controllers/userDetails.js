const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const getDataFromToken = require("../helpers/getDataFromToken");

async function userDetails(req, res) {
  try {
    const token = req.cookies.token || "";
    const user = await getDataFromToken(token);
    return res.status(200).json({
      message: "User details",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}
module.exports = userDetails;
