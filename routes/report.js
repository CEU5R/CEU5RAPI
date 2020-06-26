const express = require('express');
const {
  getReports,
  getReport,
  createReport,
  deleteReport,
  updateReport,
} = require('../controllers/report');

const Report = require('../models/Report');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
// router.use('/:reportId/courses', courseRouter);

router
  .route('/')
  .get(protect, authorize('admin'), advancedResults(Report, 'reports'), getReports)
  .post(protect, authorize('student', 'admin'), createReport);

router
  .route('/:id')
  .get(protect, authorize('admin'), getReport)
  .put(protect, authorize('student', 'admin'), updateReport)
  .put(protect, authorize('admin'), deleteReport);

module.exports = router;
