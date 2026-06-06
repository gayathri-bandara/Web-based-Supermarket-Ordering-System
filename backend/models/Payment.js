const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: String,
  userId: String,
  amount: Number,
  method: String,
  status: String
});

module.exports = mongoose.model("Payment", paymentSchema);