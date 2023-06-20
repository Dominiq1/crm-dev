const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  dateCreated: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
  },
});

module.exports = mongoose.model('Tag', TagSchema);