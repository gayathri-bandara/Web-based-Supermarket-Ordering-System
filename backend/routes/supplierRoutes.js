const router = require("express").Router();
const Supplier = require("../models/Supplier");

router.post("/", async(req,res)=>{
  const data = new Supplier(req.body);
  await data.save();
  res.json(data);
});

router.get("/", async(req,res)=>{
  const data = await Supplier.find();
  res.json(data);
});

module.exports = router;