const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  orderId: String,
  driverName: String,
  vehicle: String,
  status: String,
  eta: String
});

module.exports = mongoose.model("Delivery", deliverySchema);