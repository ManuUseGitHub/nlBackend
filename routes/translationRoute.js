// 3rd Party Modules
const { Router } = require("express");

const controller = require("../api/translationController");
const router = Router();

// Requests
router.post("/", controller.getTranslation);

module.exports = router;
