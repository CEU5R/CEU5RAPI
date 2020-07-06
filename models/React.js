const mongoose = require("mongoose");

const ReactSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.ObjectId,
    ref: "Department",
    required: true,
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description cannot be more than 500 characters"],
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
  category: {
    type: String,
    default: "React",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: String,
    enum: ["1", "2", "3", "4", "5"],
    required: true,
  },
});
module.exports = mongoose.model("Reacts", ReactSchema);
