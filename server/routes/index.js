const express = require("express");
const regiseterUser = require("../controllers/registerUser");
const checkEmail = require("../controllers/checkEmail");
const checkPassword = require("../controllers/checkPassword");
const userDetails = require("../controllers/userDetails");
const updateUserDetails = require("../controllers/updateUserDetails");
const logout = require("../controllers/logout");
const searchUsers = require("../controllers/searchUsers");

const router = express.Router();

// api endpoints

// create a new user
router.post("/register", regiseterUser);
// check user email
router.post("/email", checkEmail);
// check password and login
router.post("/password", checkPassword);
// user details
router.get("/user-details", userDetails);
// logout
router.get("/logout", logout);
// update user detials
router.post("/update", updateUserDetails);
// search users
router.post("/search-users", searchUsers);

module.exports = router;
