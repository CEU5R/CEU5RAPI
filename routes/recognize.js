const express = require('express');
const {
  getMultipleRecognize,
  getRecognize,
  createRecognize,
  deleteRecognize,
  updateRecognize,
} = require('../controllers/recognize');

const Recognize = require('../models/Recognize');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
// router.use('/:reportId/courses', courseRouter);

router
  .route('/')
  .get(advancedResults(Recognize, 'Recognize'), getMultipleRecognize)
  .post(protect, authorize('student', 'admin'), createRecognize);

router
  .route('/:id')
  .get(protect, authorize('admin'), getRecognize)
  .put(protect, authorize('student', 'admin'), updateRecognize)
  .put(protect, authorize('admin'), deleteRecognize);

module.exports = router;
