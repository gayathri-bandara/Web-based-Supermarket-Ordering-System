const router = require("express").Router();
const Delivery = require("../models/Delivery");

router.post("/", async(req,res)=>{
  const data = new Delivery(req.body);
  await data.save();
  res.json(data);
});

router.get("/", async(req,res)=>{
  const data = await Delivery.find();
  res.json(data);
});

module.exports = router;