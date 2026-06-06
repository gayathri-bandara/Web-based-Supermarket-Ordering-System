const Product = require("../models/Product");

exports.createProduct = async (req,res)=>{
  const product = new Product(req.body);
  await product.save();
  res.json(product);
};

exports.getProducts = async (req,res)=>{
  const products = await Product.find().populate("category");
  res.json(products);
};

exports.updateProduct = async (req,res)=>{
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new:true });
  res.json(updated);
};

exports.deleteProduct = async (req,res)=>{
  await Product.findByIdAndDelete(req.params.id);
  res.json("Deleted");
};