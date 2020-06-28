const express = require("express");
const {
  getReacts,
  getReact,
  createReact,
  deleteReact,
  updateReact,
} = require("../controllers/react");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(protect, authorize("admin"), getReacts)
  .post(protect, authorize("student"), createReact);

router
  .route("/:id")
  .get(protect, authorize("admin"), getReact)
  .put(protect, authorize("student", "admin"), updateReact)
  .put(protect, authorize("admin"), deleteReact);

module.exports = router;
