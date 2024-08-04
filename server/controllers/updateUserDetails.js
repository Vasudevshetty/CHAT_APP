const getDataFromToken = require("../helpers/getDataFromToken");
const User = require("../models/userModel");

async function updateUserDetails(req, res) {
  try {
    const token = req.cookies.token || "";

    const user = await getDataFromToken(token);

    const { name, profile_pic } = req.body;
    const updatedUser = await User.updateOne(
      { _id: user._id },
      {
        name,
        profile_pic,
      }
    );

    const userUpdatedInfo = await User.findById(user._id);

    return res.status(200).json({
      message: "User details updated",
      data: userUpdatedInfo,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

module.exports = updateUserDetails;
