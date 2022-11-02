//extracting router method from express module
const express = require("express");
const router = express.Router();

//extracting auth-controllers 
const authController = require("../controllers/auth-controllers");

//setting rest APIs
router.get("/googleAuthlink",authController.googleAuthPage);
router.get("/googleAuth", authController.redirectGoogleEmail);

module.exports = router;