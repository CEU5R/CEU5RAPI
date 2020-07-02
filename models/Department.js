const mongoose = require("mongoose");
const moment = require("moment");
let now = moment();

const DepartmentSchema = new mongoose.Schema({
  department: {
    type: String,
    required: [true, "Please add a Department"],
    trim: true,
    maxlength: [50, "Department name cannot be more than 50 characters"],
    unique: true,
  },
  createdAt: {
    type: String,
    default: now.format("MMMM Do YYYY, h:mm:ss a"),
  },
  status: {
    type: Number,
    enum: [1, 0],
    default: 1,
  },
});
module.exports = mongoose.model("Department", DepartmentSchema);
