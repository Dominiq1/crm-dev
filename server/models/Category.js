const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
  },
  color: {
    type: String,
  },
  description: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  // link to user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // link to lead
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
  },
});

module.exports = mongoose.model("Category", CategorySchema);
