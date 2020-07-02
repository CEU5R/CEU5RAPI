const mongoose = require("mongoose");
const moment = require("moment");
let now = moment();

const RepairSchema = new mongoose.Schema({
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
  status: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 1,
  },
  category: {
    type: String,
    default: "Repair",
  },
  photo: {
    type: String,
    default: "https://ceu5rimages.s3.us-east-1.amazonaws.com/no-photo.jpg",
  },
  building: {
    type: mongoose.Schema.ObjectId,
    ref: "Building",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});
module.exports = mongoose.model("Repair", RepairSchema);
