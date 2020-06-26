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
  .get(protect, authorize('admin'), advancedResults(Recommends, 'recommends'), getRecommends)
  .post(protect, authorize('student', 'admin'), createRecommend);

router
  .route('/:id')
  .get(protect, authorize('admin'), getRecommend)
  .put(protect, authorize('student', 'admin'), updateRecommend)
  .put(protect, authorize('admin'), deleteRecommend);

module.exports = router;
