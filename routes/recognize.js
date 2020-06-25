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
  .get(protect, advancedResults(Recognize, 'Recognize'), getMultipleRecognize)
  .post(protect, createRecognize);

router
  .route('/:id')
  .get(protect, getRecognize)
  .put(protect, updateRecognize)
  .put(protect, deleteRecognize);

module.exports = router;
