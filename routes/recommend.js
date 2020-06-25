const express = require('express');
const {
  getRecommends,
  getRecommend,
  createRecommend,
  deleteRecommend,
  updateRecommend,
} = require('../controllers/recommend');

const Recommends = require('../models/Recommend');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
// router.use('/:reportId/courses', courseRouter);

router
  .route('/')
  .get(protect, advancedResults(Recommends, 'recommends'), getRecommends)
  .post(protect, createRecommend);

router
  .route('/:id')
  .get(protect, getRecommend)
  .put(protect, updateRecommend)
  .put(protect, deleteRecommend);

module.exports = router;
