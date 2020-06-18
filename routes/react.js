const express = require('express');
const {
  getReacts,
  getReact,
  createReact,
  deleteReact,
  updateReact,
  //   reportPhotoUpload,
} = require('../controllers/react');

const React = require('../models/React');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

// const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
// router.use('/:reportId/courses', courseRouter);

// router.route('/:id/photo').put(reportPhotoUpload);

router
  .route('/')
  .get(advancedResults(React, 'React'), getReacts)
  .post(createReact);

router.route('/:id').get(getReact).put(updateReact).put(deleteReact);

module.exports = router;
