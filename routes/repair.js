const express = require("express");
const {
  getRepairs,
  getRepair,
  createRepair,
  deleteRepair,
  updateRepair,
} = require("../controllers/repair");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource routers
// router.use('/:reportId/courses', courseRouter);

router
  .route("/")
  .get(protect, authorize("admin"), getRepairs)
  .post(protect, authorize("student", "admin"), createRepair);

router
  .route("/:id")
  .get(protect, authorize("admin"), getRepair)
  .put(protect, authorize("student", "admin"), updateRepair)
  .put(protect, authorize("admin"), deleteRepair);

module.exports = router;
