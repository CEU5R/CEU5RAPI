const express = require('express');
const {
  getRecommends,
  getRecommend,
  createRecommend,
  deleteRecommend,
  updateRecommend,
  //   reportPhotoUpload,
} = require('../controllers/recommend');

const Recommends = require('../models/Recommend');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

// const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
// router.use('/:reportId/courses', courseRouter);

// router.route('/:id/photo').put(reportPhotoUpload);

router
  .route('/')
  .get(advancedResults(Recommends, 'recommends'), getRecommends)
  .post(createRecommend);

router
  .route('/:id')
  .get(getRecommend)
  .put(updateRecommend)
  .put(deleteRecommend);

module.exports = router;
