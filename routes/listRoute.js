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
router.patch("/card", listController.repearIds);
router.patch("/cards", listController.migrateToList);
router.post("/card", listController.create);
router.delete("/card", listController.remove);

module.exports = router;
