const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const React = require('../models/React');
const messages = require('../library/message-resources');

// @desc    Get all react
// @route   GET /api/v1/react
// @access  Public
exports.getReacts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single react
// @route   GET /api/v1/react/:id
// @access  Public
exports.getReact = asyncHandler(async (req, res, next) => {
  const react = await React.findById(req.params.id);

  if (!react) {
    return next(
      new ErrorResponse(messages.P0001.msg.replace(`{id}`, req.params.id), 404)
    );
  }

  res.status(200).json({ success: true, data: react });
});

// @desc    Create new react
// @route   POST /api/v1/react/
// @access  Private
exports.createReact = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  // req.body.user = req.user.id;

  const react = await React.create(req.body);

  res.status(201).json({
    success: true,
    data: react,
  });
});

// @desc    Update new react
// @route   PUT /api/v1/react/:id
// @access  Private
exports.updateReact = asyncHandler(async (req, res, next) => {
  let react = await React.findById(req.params.id);

  if (!react) {
    return next(
      new ErrorResponse(`React not found with an id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is report owner
  // if (report.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.params.id} is not authorized to update this report`,
  //       401
  //     )
  //   );
  // }

  react = await React.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: react });
});

// @desc    Delete react
// @route   DELETE /api/v1/react/:id
// @access  Private
exports.deleteReact = asyncHandler(async (req, res, next) => {
  const react = await React.findById(req.params.id);

  if (!react) {
    return next(
      new ErrorResponse(`React not found with id an of ${req.params.id}`, 404)
    );
  }

  // Make sure user is report owner
  // if (report.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.params.id} is not authorized to delete this report`,
  //       401
  //     )
  //   );
  // }

  react = await React.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: react });
});

exports.reportPhotoUpload = asyncHandler(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(
      new ErrorResponse(`Report not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is report owner
  if (report.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this report`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${report._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Report.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
