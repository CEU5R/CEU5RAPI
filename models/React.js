const mongoose = require('mongoose');

const ReactSchema = new mongoose.Schema({
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
  status: {
    type: Number,
    default: 1,
  },
});
module.exports = mongoose.model('Reacts', ReactSchema);
