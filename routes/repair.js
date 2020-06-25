const express = require('express');
const {
  getRepairs,
  getRepair,
  createRepair,
  deleteRepair,
  updateRepair,
} = require('../controllers/repair');

const Repair = require('../models/Repair');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
// router.use('/:reportId/courses', courseRouter);

router
  .route('/')
  .get(advancedResults(Repair, 'repairs'), getRepairs)
  .post(protect, createRepair);

router
  .route('/:id')
  .get(protect, getRepair)
  .put(protect, updateRepair)
  .put(protect, deleteRepair);

module.exports = router;
