const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Recognize = require('../models/Recognize');

// @desc    Get all recognize
// @route   GET /api/v1/recognize
// @access  Public
exports.getMultipleRecognize = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single recognize
// @route   GET /api/v1/recognize/:id
// @access  Public
exports.getRecognize = asyncHandler(async (req, res, next) => {
  const recognize = await Recognize.findById(req.params.id);

  if (!recognize) {
    return next(
      new ErrorResponse(
        `Recognize not found with an id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: recognize });
});

// @desc    Create new recognize
// @route   POST /api/v1/recognize/
// @access  Private
exports.createRecognize = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // If the user has a uploaded photo.
  if (req.files) {
    const photo = req.files.photo;

    // Create custom filename
    photo.name = `photo_${Date.now()}${path.parse(photo.name).ext}`;

    // Make sure the image is a photo
    if (!photo.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check filesize
    if (photo.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }

    photo.mv(
      `${process.env.FILE_UPLOAD_PATH_RECOGNIZE}/${photo.name}`,
      async (err) => {
        if (err) {
          console.log(err);
          return next(new ErrorResponse(`Problem with file upload`, 500));
        }
      }
    );

    const photoName = { photo: photo.name };
    const addedPhotoName = { ...req.body, ...photoName };
    const recognize = await Recognize.create(addedPhotoName);

    res.status(200).json({
      success: true,
      data: recognize,
    });
  }

  if (!req.files) {
    const recognize = await Recognize.create(req.body);

    res.status(200).json({
      success: true,
      data: recognize,
    });
  }
});

// @desc    Update new recommend
// @route   PUT /api/v1/recommend/:id
// @access  Private
exports.updateRecognize = asyncHandler(async (req, res, next) => {
  let recognize = await Recognize.findById(req.params.id);

  if (!recognize) {
    return next(
      new ErrorResponse(
        `Recognize not found with an id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure user is recognize owner
  if (recognize.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this recognize ${recognize._id}`,
        401
      )
    );
  }

  recognize = await Recognize.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: recognize });
});

// @desc    Delete recommend
// @route   DELETE /api/v1/recommend/:id
// @access  Private
exports.deleteRecognize = asyncHandler(async (req, res, next) => {
  const recognize = await Recognize.findById(req.params.id);

  if (!recognize) {
    return next(
      new ErrorResponse(
        `Recognize not found with id an of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure user is recognize owner
  if (recognize.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this recognize`,
        401
      )
    );
  }

  recognize = await Recognize.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: recognize });
});
