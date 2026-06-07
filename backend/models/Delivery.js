const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  orderId: String,
  driverName: String,
  driverPhone: String,
  vehicle: String,
  status: { type: String, default: "Preparing" },
  eta: String,
  currentLocation: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Delivery", deliverySchema);
