//extracting router method from express module
const express = require("express");
const router = express.Router();

//extracting complain-model router functions
const complainController = require("../controllers/complain-controllers");

//setting res APIs
router.get("/username/:uid", complainController.userComplain);
router.post("/filter", complainController.filterComplain);
router.post("/add", complainController.addComplain);
router.post("/update", complainController.updateComplain);
router.get("/latest", complainController.latestComplain);
router.get("/getDetails/:cid", complainController.getComplainDetails);
router.delete("/:cid", complainController.deleteComplain);

module.exports = router;
