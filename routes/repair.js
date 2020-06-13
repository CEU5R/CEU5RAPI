const express = require('express');
const {
  getRepairs,
  getRepair,
  createRepair,
  deleteRepair,
  updateRepair,
  //   reportPhotoUpload,
} = require('../controllers/repair');

const Repair = require('../models/Repair');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

// const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
// router.use('/:reportId/courses', courseRouter);

// router.route('/:id/photo').put(reportPhotoUpload);

router
  .route('/')
  .get(advancedResults(Repair, 'repairs'), getRepairs)
  .post(createRepair);

router.route('/:id').get(getRepair).put(updateRepair).delete(deleteRepair);

module.exports = router;
