// 3rd Party Modules
const { Router } = require("express");

// Local Modules
const keyGeneratorController = require("../api/keyGeneratorController");

// Initialization
const router = Router();

// Requests
router.post("/", keyGeneratorController.generate);

module.exports = router;
