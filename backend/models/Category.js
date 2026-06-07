const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  aisle: String,
});

module.exports = mongoose.model("Category", categorySchema);
