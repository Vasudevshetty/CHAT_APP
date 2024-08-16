const User = require("../models/userModel");

async function searchUsers(req, res) {
  try {
    const { search } = req.body;
    const query = new RegExp(search, "i", "g");
    const user = await User.find({
      $or: [{ name: query }, { email: query }],
    }).select("-password");

    return res.json({
      message: "Searched users",
      data: user,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

module.exports = searchUsers;
