const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const React = require("../models/React");
const messages = require("../library/message-resources");

// @desc    Get all react
// @route   GET /api/v1/react
// @access  Public
exports.getReacts = asyncHandler(async (req, res, next) => {
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
  query = React.find(JSON.parse(queryStr))
    .populate("user")
    .populate("department");

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
  const total = await React.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const reacts = await query;

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
    .json({ success: true, count: reacts.length, pagination, data: reacts });
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
  req.body.user = req.user.id;

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

  // Make sure user is react owner
  if (react.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this react ${react._id}`,
        401
      )
    );
  }

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

  // Make sure user is react owner
  if (react.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this react`,
        401
      )
    );
  }

  react = await React.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: react });
});
