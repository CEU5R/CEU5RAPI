const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Recommend = require("../models/Recommend");

// @desc    Get all recommends
// @route   GET /api/v1/recommend
// @access  Public
exports.getRecommends = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single recommend
// @route   GET /api/v1/recommend/:id
// @access  Public
exports.getRecommend = asyncHandler(async (req, res, next) => {
  const recommend = await Recommend.findById(req.params.id);

  if (!recommend) {
    return next(
      new ErrorResponse(
        `Recommend not found with an id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: recommend });
});

// @desc    Create new recommend
// @route   POST /api/v1/recommend/
// @access  Private
exports.createRecommend = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const file = req.file;

  let recommend;

  if (file) {
    // Add url to req.body
    const photoUrl = req.file.location;

    const photoName = { photo: photoUrl };
    const addedPhotoName = { ...req.body, ...photoName };
    recommend = await Recommend.create(addedPhotoName);
  } else {
    recommend = await Recommend.create(req.body);
  }

  res.status(200).json({
    success: true,
    data: recommend,
  });
});

// @desc    Update new recommend
// @route   PUT /api/v1/recommend/:id
// @access  Private
exports.updateRecommend = asyncHandler(async (req, res, next) => {
  let recommend = await Recommend.findById(req.params.id);

  if (!recommend) {
    return next(
      new ErrorResponse(
        `Recommend not found with an id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure user is recommend owner
  if (recommend.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this recommend ${recommend._id}`,
        401
      )
    );
  }

  recommend = await Recommend.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: recommend });
});

// @desc    Delete recommend
// @route   DELETE /api/v1/recommend/:id
// @access  Private
exports.deleteRecommend = asyncHandler(async (req, res, next) => {
  const recommend = await Recommend.findById(req.params.id);

  if (!recommend) {
    return next(
      new ErrorResponse(
        `Recommend not found with id an of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure user is recommend owner
  if (recommend.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this recommend ${recommend._id}`,
        401
      )
    );
  }

  recommend = await Recommend.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: recommend });
});
