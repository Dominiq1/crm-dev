// write schema for leads table

const mongoose = require("mongoose");

const FilterSchema = mongoose.Schema({
  columns: {
    type: Array,
  },

  closedColumns: {
    type: Array,
  },
  isClosed: {
    type: Boolean,
    default: false,
  },

  pageSize: {
    type: Number,
  },
  page: {
    type: Number,
  },
  sort: {
    type: String,
  },

  search: {
    type: String,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Filter", FilterSchema);
