const Building = require('../models/Building');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const messages = require('../library/message-resources');

// @desc    Create new building
// @route   POST /api/v1/react/building
// @access  Private
exports.createBuilding = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.user = req.user.id;

    const building = await Building.create(req.body);

    res.status(201).json({
        success: true,
        data: building,
    });
});

// @desc    Get all building
// @route   GET /api/v1/building
// @access  Private
exports.getBuilding = asyncHandler(async (req, res, next) => {
    const building = await Building.find();

    res.status(200).json({ success: true, data: building });
});

// @desc    Update building
// @route   PUT /api/v1/building/:id
// @access  Private

exports.updateBuilding = asyncHandler(async (req, res, next) => {
    let building = await Building.findById(req.params.id);

    if (!building) {
        return next(
            new ErrorResponse(`Building not found with an id of ${req.params.id}`, 404)
        );
    }

    building = await Building.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ success: true, data: building });
});

// @desc    Delete building
// @route   PUT /api/v1/building/:id
// @access  Private
exports.deleteBuilding = asyncHandler(async (req, res, next) => {
    let building = await Building.findById(req.params.id);

    if (!building) {
        return next(
            new ErrorResponse(`Building not found with an id of ${req.params.id}`, 404)
        );
    }

    building = await Building.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ success: true, data: building });
});