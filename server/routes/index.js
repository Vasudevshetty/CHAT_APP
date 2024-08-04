const express = require("express");
const regiseterUser = require("../controllers/registerUser");
const checkEmail = require("../controllers/checkEmail");
const checkPassword = require("../controllers/checkPassword");

const router = express.Router();

// api endpoints

// create a new user
router.post("/register", regiseterUser);
// check user email
router.post("/email", checkEmail);
// check password and login
router.post("/password", checkPassword)

module.exports = router;
