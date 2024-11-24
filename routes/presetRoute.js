// 3rd Party Modules
const { Router } = require("express");

// Local Modules
const presetController = require("../api/presetController");

// Initialization
const router = Router();

// Requests
router.get("/", presetController.getAll);
router.post("/", presetController.create);
router.delete("/:id", presetController.delete);


module.exports = router;
