const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: String,
  userId: String,
  amount: Number,
  method: { type: String, default: "Card" },
  status: { type: String, default: "Pending" },
  invoiceNo: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
