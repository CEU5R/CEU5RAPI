const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Report = require('../models/Report');

// @desc    Get all reports
// @route   GET /api/v1/reports
// @access  Public
exports.getReports = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single report
// @route   GET /api/v1/report/:id
// @access  Public
exports.getReport = asyncHandler(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(
      new ErrorResponse(`Report not found with an id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: report });
});

// @desc    Create new report
// @route   POST /api/v1/reports/
// @access  Private
exports.createReport = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  // req.body.user = req.user.id;

  const report = await Report.create(req.body);

  res.status(201).json({
    success: true,
    data: report,
  });
});

// @desc    Update new reports
// @route   PUT /api/v1/reports/:id
// @access  Private
exports.updateReport = asyncHandler(async (req, res, next) => {
  let report = await Report.findById(req.params.id);

  if (!report) {
    return next(
      new ErrorResponse(`Report not found with id of ${req.params.id}`, 404)
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

  report = await Report.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: report });
});

// @desc    Delete reports
// @route   DELETE /api/v1/reports/:id
// @access  Private
exports.deleteReport = asyncHandler(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(
      new ErrorResponse(`Report not found with id of ${req.params.id}`, 404)
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

  report.remove();

  res.status(200).json({ success: true, data: {} });
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
