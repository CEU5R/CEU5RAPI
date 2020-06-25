const express = require('express');
const {
  getReacts,
  getReact,
  createReact,
  deleteReact,
  updateReact,
} = require('../controllers/react');

const React = require('../models/React');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
// router.use('/:reportId/courses', courseRouter);

router
  .route('/')
  .get(advancedResults(React, 'React'), getReacts)
  .post(protect, authorize('student', 'admin'), createReact);

router
  .route('/:id')
  .get(protect, authorize('admin'), getReact)
  .put(protect, authorize('student', 'admin'), updateReact)
  .put(protect, authorize('admin'), deleteReact);

module.exports = router;
