const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  stock: Number,
  rating: { type: Number, default: 5 },
  isFlashSale: { type: Boolean, default: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  image: String,
});

module.exports = mongoose.model("Product", productSchema);