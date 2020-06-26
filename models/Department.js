const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    department: {
        type: String,
        required: [true, 'Please add a Department'],
        trim: true,
        maxlength: [50, 'Department name cannot be more than 50 characters'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: Number,
        enum: [1, 0],
        default: 1,
    },
});
module.exports = mongoose.model('Department', DepartmentSchema);