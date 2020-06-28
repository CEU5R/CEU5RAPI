const express = require("express");
const {
  createBuilding,
  getBuilding,
  updateBuilding,
  deleteBuilding,
} = require("../controllers/building");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .post(protect, authorize("admin"), createBuilding)
  .get(protect, getBuilding);

router
  .route("/:id")
  .put(protect, authorize("admin"), updateBuilding)
  .put(protect, authorize("admin"), deleteBuilding);

module.exports = router;
