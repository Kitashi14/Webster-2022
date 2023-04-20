//extracting router method from express module
const express = require("express");
const router = express.Router();

//extracting worker-model router functions
const workerController = require("../controllers/worker-controllers");

//setting rest APIs
router.post("/add", workerController.addWorker);
router.get("/getDetails/:uid/:profession",workerController.getWorkerDetails);
router.get("/filter/:profession",workerController.filterWorker);
router.delete("/:workerUsername/:profession",workerController.deleteWorker);

module.exports = router;