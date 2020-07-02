const mongoose = require("mongoose");
const moment = require("moment");
let now = moment();

const BuildingSchema = new mongoose.Schema({
  building: {
    type: String,
    required: [true, "Please add a building"],
    trim: true,
    maxlength: [50, "Building name cannot be more than 50 characters"],
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
module.exports = mongoose.model("Building", BuildingSchema);
