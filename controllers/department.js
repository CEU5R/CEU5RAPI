const Department = require('../models/Department');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const messages = require('../library/message-resources');

// @desc    Create new deparment
// @route   POST /api/v1/react/department
// @access  Private
exports.createDepartment = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.user = req.user.id;

    const deparment = await Department.create(req.body);

    res.status(201).json({
        success: true,
        data: deparment,
    });
});

// @desc    Get all deparments
// @route   GET /api/v1/react/department
// @access  Private
exports.getDepartments = asyncHandler(async (req, res, next) => {
    const department = await Department.find();

    res.status(200).json({ success: true, data: department });
});

// @desc    Update deparment
// @route   PUT /api/v1/react/department/:id
// @access  Private

exports.updateDepartment = asyncHandler(async (req, res, next) => {
    let department = await Department.findById(req.params.id);

    if (!department) {
        return next(
            new ErrorResponse(`Deparment not found with an id of ${req.params.id}`, 404)
        );
    }

    department = await Department.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ success: true, data: department });
});

// @desc    Update deparment
// @route   PUT /api/v1/react/department/:id
// @access  Private
exports.deleteDepartment = asyncHandler(async (req, res, next) => {
    let department = await Department.findById(req.params.id);

    if (!department) {
        return next(
            new ErrorResponse(`Deparment not found with an id of ${req.params.id}`, 404)
        );
    }

    react = await React.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ success: true, data: department });
});