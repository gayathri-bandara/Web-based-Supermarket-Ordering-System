const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      productId: String,
      quantity: Number
    }
  ],
  total: Number,
  address: String,
  status: { type: String, default: "Pending" }
});

module.exports = mongoose.model("Order", orderSchema);