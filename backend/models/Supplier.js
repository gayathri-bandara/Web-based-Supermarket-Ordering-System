const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: String,
  contact: String,
  items: [String]
});

module.exports = mongoose.model("Supplier", supplierSchema);