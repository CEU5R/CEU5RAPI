const express = require('express');
const {
  getMultipleRecognize,
  getRecognize,
  createRecognize,
  deleteRecognize,
  updateRecognize,
  //   reportPhotoUpload,
} = require('../controllers/recognize');

const Recognize = require('../models/Recognize');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

// const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
// router.use('/:reportId/courses', courseRouter);

// router.route('/:id/photo').put(reportPhotoUpload);

router
  .route('/')
  .get(advancedResults(Recognize, 'Recognize'), getMultipleRecognize)
  .post(createRecognize);

router
  .route('/:id')
  .get(getRecognize)
  .put(updateRecognize)
  .delete(deleteRecognize);

module.exports = router;
