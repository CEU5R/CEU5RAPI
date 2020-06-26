const mongoose = require('mongoose');

const BuildingSchema = new mongoose.Schema({
    building: {
        type: String,
        required: [true, 'Please add a building'],
        trim: true,
        maxlength: [50, 'Building name cannot be more than 50 characters'],
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
module.exports = mongoose.model('Building', BuildingSchema);