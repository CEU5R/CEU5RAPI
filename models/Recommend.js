const mongoose = require('mongoose');

const RecommendSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  photo: {
    type: String,
    default: 'https://ceu5rimages.s3.us-east-1.amazonaws.com/no-photo.jpg',
  },
  type: {
    type: String,
    default: 'Recommend',
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
module.exports = mongoose.model('Recommend', RecommendSchema);
