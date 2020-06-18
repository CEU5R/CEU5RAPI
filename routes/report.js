const express = require('express');
const {
  getReports,
  getReport,
  createReport,
  deleteReport,
  updateReport,
  reportPhotoUpload,
} = require('../controllers/report');

const Report = require('../models/Report');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

// const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
// router.use('/:reportId/courses', courseRouter);

router.route('/:id/photo').put(reportPhotoUpload);

router
  .route('/')
  .get(advancedResults(Report, 'reports'), getReports)
  .post(createReport);

router.route('/:id').get(getReport).put(updateReport).put(deleteReport);

module.exports = router;
