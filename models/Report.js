const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Please add a Subject'],
    trim: true,
    maxlength: [50, 'Subject cannot be more than 50 characters'],
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  solution: {
    type: String,
    maxlength: [1000, 'Solution cannot be more than 1000 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    default: 'Report',
  },
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
  status: {
    type: Number,
    enum: [1, 0],
    default: 1,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});
module.exports = mongoose.model('Report', ReportSchema);
