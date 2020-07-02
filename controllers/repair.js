const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Repair = require("../models/Repair");
const { count } = require("console");

// @desc    Get all repairs
// @route   GET /api/v1/repair
// @access  Public
exports.getRepairs = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  console.log(reqQuery);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = Repair.find(JSON.parse(queryStr))
    .populate("user")
    .populate("building");

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Repair.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const repairs = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res
    .status(200)
    .json({ success: true, count: repairs.length, pagination, data: repairs });
});

// @desc    Get single repair
// @route   GET /api/v1/repair/:id
// @access  Public
exports.getRepair = asyncHandler(async (req, res, next) => {
  const repair = await Repair.findById(req.params.id);

  if (!repair) {
    return next(
      new ErrorResponse(`Report not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: repair });
});

// @desc    Create new repair
// @route   POST /api/v1/repair/
// @access  Private
exports.createRepair = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const file = req.file;

  if (file) {
    // Add url to req.body
    const photoUrl = req.file.location;

    const photoName = { photo: photoUrl };
    const addedPhotoName = { ...req.body, ...photoName };
    const report = await Repair.create(addedPhotoName);
  }

  if (!file) {
    const report = await Repair.create(req.body);
  }

  res.status(200).json({
    success: true,
  });
});

// @desc    Update new reports
// @route   PUT /api/v1/reports/:id
// @access  Private
exports.updateRepair = asyncHandler(async (req, res, next) => {
  let repair = await Repair.findById(req.params.id);

  if (!repair) {
    return next(
      new ErrorResponse(`Report not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is report owner
  if (repair.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this repair ${repair._id}`,
        401
      )
    );
  }

  repair = await Repair.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: repair });
});

// @desc    Delete repairs
// @route   DELETE /api/v1/repair/:id
// @access  Private
exports.deleteRepair = asyncHandler(async (req, res, next) => {
  const repair = await Repair.findById(req.params.id);

  if (!repair) {
    return next(
      new ErrorResponse(`Repair not found with an id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is repair owner
  if (repair.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this repair ${repair._id}`,
        401
      )
    );
  }

  repair = await Repair.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: repair });
});

exports.reportPhotoUpload = asyncHandler(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(
      new ErrorResponse(`Report not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is report owner
  if (report.user.toString() !== req.user.id && req.user.role !== "admin") {
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
  if (!file.mimetype.startsWith("image")) {
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
