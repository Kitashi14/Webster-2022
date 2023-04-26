/** @format */

//extracting router method from express module
const express = require("express");
const router = express.Router();

//extracting user-model router functions
const userController = require("../controllers/user-controllers");

//setting rest APIs
router.post("/createAccount", userController.createAccount);
router.post("/resetPassword", userController.resetPassword);
router.get("/getDetails/:uid", userController.getUserDetail);
router.patch("/favorite/:username/:id", userController.addfavoriteworker);
router.delete("/favorite/:username/:id", userController.deletefavoriteworker);
router.patch("/updateUser", userController.updateUser);
module.exports = router;
