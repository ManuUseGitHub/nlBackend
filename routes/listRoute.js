// 3rd Party Modules
const { Router } = require("express");

// Local Modules
const listController = require("../api/listController");

// Initialization
const router = Router();

// Requests
router.get("/", listController.getAll);
router.get("/card/:id", listController.getOne);
router.put("/card", listController.update);
router.post("/card", listController.create);

module.exports = router;
