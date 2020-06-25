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
  .get(protect, advancedResults(Report, 'reports'), getReports)
  .post(protect, createReport);

router
  .route('/:id')
  .get(protect, getReport)
  .put(protect, updateReport)
  .put(protect, deleteReport);

module.exports = router;
