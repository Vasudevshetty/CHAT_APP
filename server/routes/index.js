const express = require("express");
const regiseterUser = require("../controllers/registerUser");

const router = express.Router();

// api endpoints to register
router.post("/register", regiseterUser);

module.exports = router;
