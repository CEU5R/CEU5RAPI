const mongoose = require("mongoose");
const moment = require("moment");
let now = moment();

const ReportSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, "Please add a Subject"],
    trim: true,
    maxlength: [50, "Subject cannot be more than 50 characters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  solution: {
    type: String,
    maxlength: [1000, "Solution cannot be more than 1000 characters"],
  },
  createdAt: {
    type: String,
    default: now.format("MMMM Do YYYY, h:mm:ss a"),
  },
  category: {
    type: String,
    default: "Report",
  },
  photo: {
    type: String,
    default: "https://ceu5rimages.s3.us-east-1.amazonaws.com/no-photo.jpg",
  },
  status: {
    type: Number,
    enum: [1, 0],
    default: 1,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});
module.exports = mongoose.model("Report", ReportSchema);
