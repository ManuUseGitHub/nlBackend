// 3rd Party Modules
const { Router } = require("express");

// Local Modules
const fileController = require("../api/fileController");

// Initialization
const router = Router();

// Requests
router.post("/", fileController.getCSV);

module.exports = router;
