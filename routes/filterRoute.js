// 3rd Party Modules
const { Router } = require("express");

// Local Modules
const filterController = require("../api/filterController");

// Initialization
const router = Router();

// Requests
router.get("/", filterController.getAll);
router.put("/", filterController.update);

module.exports = router;
