//extracting router method from express module
const express = require("express");
const router = express.Router();

//extracting worker-model router functions
const workerController = require("../controllers/worker-controllers");

//setting rest APIs
router.post("/add", workerController.addWorker);
router.get("/:uid/:profession",workerController.getWorkerDetails);

module.exports = router;