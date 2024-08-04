const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");

async function regiseterUser(req, res) {
  try {
    console.log(req.body);
    const { name, email, password, profile_pic } = req.body;

    const checkEmail = User.findOne({ email });
    if (!checkEmail)
      res.status(400).json({
        message: "Already user exists",
        error: true,
      });

    // password into hash password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      profile_pic,
      password: hashPassword,
    };

    const user = new User(payload);

    user.save();

    res.status(201).json({
      message: "User created succesfully",
      data: user,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
    });
  }
}

module.exports = regiseterUser;
