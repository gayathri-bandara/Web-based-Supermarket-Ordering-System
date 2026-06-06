const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req,res)=>{
  const { items } = req.body;

  for(let item of items){
    const product = await Product.findById(item.productId);
    product.stock -= item.quantity;
    await product.save();
  }

  const order = new Order(req.body);
  await order.save();

  res.json(order);
};

exports.getOrders = async (req,res)=>{
  const orders = await Order.find();
  res.json(orders);
};