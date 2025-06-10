// 3rd Party Modules
const { Router } = require("express");

// Local Modules
const apiKeyController = require("../api/apiKeyController");

// Initialization
const router = Router();

// Requests
router.put("/", apiKeyController.update);
router.get("/", apiKeyController.getKey);
router.delete("/", apiKeyController.deleteKey);

module.exports = router;
