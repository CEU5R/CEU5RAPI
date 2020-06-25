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
  .get(protect, advancedResults(React, 'React'), getReacts)
  .post(protect, createReact);

router
  .route('/:id')
  .get(protect, getReact)
  .put(protect, updateReact)
  .put(protect, deleteReact);

module.exports = router;
